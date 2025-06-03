// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


/**
* @title MineralMarketplace contract
* @author @0xJonaseb11
* @notice marketplace for trading refined and market ready minerals
* @dev handles mineral storage, listing and trading 
* @Supports ETH and ERC20 tokesn payments to purchases
*/


import { RolesManager } from "../access/RolesManager.sol";
import { Errors } from "../libraries/Errors.sol";
import { Events } from "../utils/Event.sol"; 
import { MineralUtils } from "../utils/MineralUtils.sol";
import { MineralRegistry } from "./MineralRegistry.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract MineralMarketplace is RolesManager, ReentrancyGuard {
    
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;
    using MineralUtils for MineralUtils.MineralSale;
    using MineralUtils for MineralUtils.TokenPrice;

    uint256 public constant MAX_FEE_PERCENT = 1000; // 10% max fee
    uint256 public constant FEE_DENOMINATOR = 10000; // Basis points

    MineralRegistry public mineralRegistry;
    address public feeCollector;
    uint256 public platformFeePercent;
    EnumerableSet.AddressSet private acceptedTokens;

    mapping(string => MineralUtils.MineralSale) public mineralSales;
    mapping(string => mapping(address => uint256)) public tokenPrices;
    mapping(address => uint256) public ethBalances;
    mapping(address => mapping(address => uint256)) public tokenBalances;

    constructor (
        address _rolesManager,
        address _mineralRegistry,
        address _feeCollector,
        uint256 _platformFeePercent
    ) RolesManager() {
        if (_mineralRegistry == address(0) || _rolesManager == address(0) || _feeCollector == address(0)) {
            revert Errors.Invalid__ZeroAddress();
        }

        if (_platformFeePercent > MAX_FEE_PERCENT) revert Errors.InvalidFee();
    

        // pre-approve common stablecoins
        _addToken(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48); // USDC
        _addToken(0xdAC17F958D2ee523a2206206994597C13D831ec7); // USDT
        _addToken(0x6B175474E89094C44Da98b954EedeAC495271d0F); // DAI
    }

    // ------------- ## Admin ----------------- //
    function setFeeCollector(address _feeCollector) external onlyNonZeroAddress(_feeCollector) onlyRole(DEFAULT_ADMIN_ROLE) {
        feeCollector = _feeCollector;
        emit Events.FeeCollectorUpdated(_feeCollector);
    }

    function setPlatformFee(uint256 _platformFeePercent) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_platformFeePercent > MAX_FEE_PERCENT) revert Errors.InvalidFee();
        platformFeePercent = _platformFeePercent;
        emit Events.PlatformFeePercentUpdated(_platformFeePercent);
    }

    function addPaymentToken(address _token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _addToken(_token);
    }

    function removePaymentToken(address _token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!acceptedTokens.contains(_token)) revert Errors.TokenNotAccepted(_token);
        acceptedTokens.remove(_token);

        emit Events.PaymentTokenRemoved(_token);
    }

    function _addToken(address _token) onlyNonZeroAddress(_token) private {
        if (acceptedTokens.contains(_token)) return;

        acceptedTokens.add(_token);
        emit Events.PaymentTokenAdded(_token);

    }

    // ------------- ## Mineral listing --------- //
    function listMineral(
        string calldata mineralId,
        uint256 ethPrice,
        MineralUtils.TokenPrice[] calldata prices
    ) external nonReentrant {

        MineralUtils.MineralDetails memory mineral = mineralRegistry.getMineralDetails(mineralId);
        if (!mineral.isRefined) revert Errors.MineralNotRefined(mineralId);
        if (mineral.currentHandler != msg.sender) revert Errors.UnauthorizedAccess();
        if (ethPrice == 0) revert Errors.InvalidMineralPrice();

        MineralUtils.MineralSale storage sale = mineralSales[mineralId];
        if (sale.isListed) revert Errors.MineralAlreadyListed(mineralId);
        
        // eth prices set
        sale.seller = msg.sender;
        sale.ethPrice = ethPrice;
        sale.isListed = true;
        sale.listingTimestamp = block.timestamp;

        // token prices set
        for (uint i = 0; i < prices.length; i++) {
            if (!acceptedTokens.contains(prices[i].token)) revert Errors.TokenNotAccepted(prices[i].token);
            if (prices[i].price == 0) revert Errors.InvalidMineralPrice();
        }

        emit Events.MineralListed(mineralId, msg.sender, ethPrice, prices);

    }

    function delistMineral(string calldata mineralId) external nonReentrant {
        MineralUtils.MineralSale storage sale = mineralSales[mineralId];
        if (sale.seller != msg.sender) revert Errors.UnauthorizedAccess();
        if (!sale.isListed) revert Errors.MineralNotListed(mineralId);
        if (sale.isSold) revert Errors.MineralAlreadySold(mineralId);

        sale.isListed = false;
        emit Events.MineralDelisted(mineralId);
    }

    // ----------------- ## Tradinf functions ---------- //
    function buyMineralWithETH(string calldata mineralId) external payable nonReentrant {
        MineralUtils.MineralSale storage sale = mineralSales[mineralId];
        _validateSale(sale, address(0));

        uint256 requiredAmount = sale.ethPrice;
        if (msg.value > requiredAmount || msg.value != requiredAmount) {
            revert Errors.InvalidPayment();
        }
        if (msg.value < requiredAmount) {
            revert Errors.InsufficientPayment(requiredAmount, msg.value);
        }

        // process payment
        _processPayment(mineralId, sale.seller, address(0), requiredAmount);

        // transfer mineral ownership
        mineralRegistry.updateMineral(mineralId, "status", "Sold", "");
        mineralRegistry.updateMineral(mineralId, "currentHandler", "",  abi.encode(msg.sender));
    }

    function buyMineralWithToken(
        string calldata mineralId,
        address token,
        uint256 amount
    ) external nonReentrant {
        MineralUtils.MineralSale storage sale = mineralSales[mineralId];
        _validateSale(sale, token);

        uint256 requiredAmount = tokenPrices[mineralId][token];
        if (amount < requiredAmount) {
            revert Errors.InsufficientPayment(requiredAmount, amount);
        }

        // transfer tokens from buyer
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // processPayment
        _processPayment(mineralId, sale.seller, token, requiredAmount);

        // transfer mineral ownership
        mineralRegistry.updateMineral(mineralId, "status", "Sold", "");
        mineralRegistry.updateMineral(mineralId, "currentHandler", "", abi.encode(msg.sender));
    }

    function _validateSale(MineralUtils.MineralSale storage sale, address token) private view {
        if (!sale.isListed) revert Errors.MineralNotListed("");
        if (sale.isSold) revert Errors.MineralAlreadySold("");

        if (token != address(0)) {
            if (!acceptedTokens.contains(token)) revert Errors.TokenNotAccepted(token);
            if (tokenPrices[sale.mineralId][token] == 0) revert Errors.TokenNotAccepted(token);
        }
    }

    function _processPayment(
        string calldata mineralId,
        address seller,
        address token,
        uint256 amount
    ) private {
        MineralUtils.MineralSale storage sale = mineralSales[mineralId];
        sale.isSold = true;
        sale.isListed = false;
        sale.saleTimestamp = block.timestamp;

        // calculate fees
        uint256 feeAmount = (amount * platformFeePercent) / FEE_DENOMINATOR;
        uint256 sellerAmount = amount - feeAmount;

        // Distribute funds
        if (token == address(0)) {
            // ETH payment
            ethBalances[seller] += sellerAmount;
            ethBalances[feeCollector] += feeAmount;
        } else {
            // token payment
            tokenBalances[token][seller]  += sellerAmount;
            tokenBalances[token][feeCollector] += feeAmount;
        } 

        emit Events.MineralSold(mineralId, msg.sender, seller, token, amount, feeAmount);

    }

    //  ------------------- ## Fund withdrawal ----------- //
    function withdrawETH(uint256 amount) external nonReentrant {
        if (amount > ethBalances[msg.sender]) {
            revert Errors.InsufficientPayment(ethBalances[msg.sender], amount);
        }

        ethBalances[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert Errors.TransferFailed();

        emit Events.FundsWithdrawn(msg.sender, address(0), amount);
    }

    function withdrawToken(address token, uint256 amount) external nonReentrant {
        if (!acceptedTokens.contains(token)) revert Errors.TokenNotAccepted(token);
        if (amount > tokenBalances[token][msg.sender]) {
            revert Errors.InsufficientPayment(tokenBalances[token][msg.sender], amount);
        }

        tokenBalances[token][msg.sender] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);

        emit Events.FundsWithdrawn(msg.sender, token, amount);
    }

    // getters and helpers
    function getAccepetedTokens() external view returns(address [] memory) {
        return acceptedTokens.values();
    }

    function getTokenPrice(string calldata mineralId, address token) external view returns(uint256) {
        return tokenPrices[mineralId][token];
    }

    function isMineralListed(string calldata mineralId) external view returns(bool) {
        return mineralSales[mineralId].isListed && !mineralSales[mineralId].isSold;
    }

    function getMineralSaleInfo(string calldata mineralId) 
    external
    view 
    returns(
        address seller,
        uint256 ethPrice,
        bool isListed,
        bool isSold,
        uint256 saleTimestamp
    ) {
        MineralUtils.MineralSale storage sale = mineralSales[mineralId];
        return (
            sale.seller,
            sale.ethPrice,
            sale.isListed,
            sale.isSold,
            sale.saleTimestamp
        );
    }

    receive() external payable{}


}