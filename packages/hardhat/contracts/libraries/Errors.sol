// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Errors {
    
    // ---------------- # MineralRegistry errors ------ //
    error MineralRegistry__MineralNotRegistered(string mineralId);
    error MineralRegistry__MineralAlreadyPurchased();
    error MineralRegistry__MineralAlreadyAudited();
    error MineralRegistry__MineralAlreadyInspected();
    error MineralRegistry__MineralNotAudited();
    error MineralRegistry__MineralNotInspected();
    error MineralNotRefined(string mineralId);

    error MineralRegistry__InvalidMineralDetails();
    error MineralRegistry__InvalidMineralIdOrNotFound(string mineralId);
    error MineralRegistry__InvalidMineralStatus();
    error MineralRegistry__InvalidMineralName();
    error MineralRegistry__InvalidMineralOrigin();
    error MineralRegistry__InvalidMineralType();
    error MineralRegistry__InvalidMineralWeight();
    error MineralRegistry__InvalidMineralPurityPercentage();
    error MineralRegistry__InvalidMineralStorageConditions();
    error MineralRegistry__InvalidMineralLocation();
    error MineralRegistry__InvalidReceivingPartyAddress();
    error MineralRegistry__InvalidMineralDestination();
    error MineralRegistry__InvalidUpdateType();
    error MineralRegistry__InvalidDetailField();

    error MineralNotReadyToTrade(string mineralId);

    // ------------ # RolesManager ----------- //
    error RolesManager__MineralAlreadyRefined(string mineralId);
    error RolesManager__MineralAlreadyPurchased(string mineralId);
    error RolesManager__MineralAlreadyInspected(string mineralId);
    error RolesManager__MineralAlreadyAudited(string mineralId);
    error RolesManager__NotTheAssignedBuyer(address caller);
    error RolesManager__InvalidMineralName();
    error RolesManager__InvalidMineralOrigin();
    error RolesManager__InvalidMineralDestination();
    error RolesManager__MineralNotMarketReady(string mineralId);
    error RolesManager__InvalidMineralIdOrNotFound();
    error RolesManager__InvalidMineralType();
    error RolesManager__InvalidReceivingPartyAddress();
    error RolesManager__InvalidMineralStorageConditions();
    error RolesManager__InvalidMineralPurityPercentage();
    error RolesManager__MineralPurityPercentageTooLowToRegister(uint256 purityPercentage);
    error RolesManager__InvalidMineralWeight();
    error RolesManager__InvalidAddress();
    error RolesManager__InvalidRole();
    error RolesManager__AccountAlreadyHasRole();
    error RolesManager__AccountDoesNotHaveRole();

    // ------------ # DisputeResolution ----------- //
    error DisputeResolution__InvalidMineralIdOrNotFound();
    error DisputeResolution__InvalidDisputeDefendantAddress();
    error DisputeResolution__InvalidDisputeDetails();
    error DisputeResolution__InvalidDisputeEvidence();
    error DisputeResolution__InvalidDisputeIdOrNotFound();
    error DisputeResolution__InvalidResolutionDetails();
    error DisputeResolution__DisputeStatusNotPendingOrEscalated();
    error DisputeResolution__DisputeStatusNotPending(uint256 disputeId);
    error DisputeResolution__NotEligibleToVote(address caller);
    error DisputeResolution__AlreadyVoted(address caller);
    error DisputeResolution__DisputeEscalated_UnableToVote(uint256 disputeId);
    error DisputeResolution__VotingPeriodStillActive();
    error DisputeResolution__DisputeNotEscalated(uint256 disputeId);

    // -------------- # MineralWarehouse errors ----------- //
    error MineralWarehouse__InvalidTokenAddress(address tokenAddress);
    error MineralWarehouse__MineralNotRefined(string mineralId);
    error MineralWarehouse__InvalidNumberOfPrices();
    error MineralWarehouse__UnacceptedToken(address tokenAddress);
    error MineralWarehouse__UnacceptedTokens(address[] tokenAddresses);
    error MineralWarehouse__MineralNotMarketReady(string mineralId);
    error MineralWarehouse__InvalidMineralPrice();
    error MineralWarehouse__MineralAlreadySold(string mineralId);
    error MineralWarehouse__UnauthorizedSeller(address seller);
    error MineralNotMarketReady(string mineralId);
    error MineralWarehouse__IncorrectETHAmount();
    error MineralWarehouse__ETHTransferFailed();
    error MineralWarehouse__InvalidTokenPrice();

    error MineralWarehouse__MismatchedArrays();
    error MineralWarehouse__InvalidETHPrice();
    error MineralWarehouse__TokenNotAccepted(address tokenAddress);

    error MineralWarehouse__MineralNotFoundInWarehouse(string mineralId);

    // ---------- # Tokenization errors --------- //
    error Tokenization__TokenAlreadyExists(uint256 tokenId);
    error Tokenization__TokenIsAlreadyMinted(uint256 tokenId);
    error Tokenization__InvalidTokenIdOrNotFound(uint256 tokenId);
    error Tokenization__CallerNotMineralTokenOwner(uint256 tokenId, address caller);
    error Tokenization__InvalidTokenId(uint256 tokenId);

    // ------------ # TransactionLog errors ----------- //
    error TransactionLog__InvalidOperationType();
    error TransactionLog__InvalidOperationIndex(uint256 index);
    error TransactionLog__InvalidTransactionIdOrNotFound(uint256 transactionId);

    // ----------- # SupplychainValidator errors ---------- //
    error SupplychainValidator__InvalidMineralIdOrNotFound(string mineralId);
    error SupplychainValidator__InvalidMineralTransactionHistory();
    error SupplychainValidator__InvalidMineralOwnershipChain();

    // --------- # Global errors -------- //
    error InvalidAccountAddress();
    error ERC20TokenTransferFailed(address token, uint256 tokenAmount);
    error InvalidPaymentMethods();
    error InvalidMineralIdOrNotFound(string mineralId);
    error InsufficientPermissionsToPerformAction(address caller);

    // ------ # LogisticsManager errors ------ //
    error TransportRequestAlreadyExists(string mineralId);
    error AddressDoesNotHaveRequiredRole(address caller, bytes32 role);
    error NotAssignedTransporter(string mineralId, address caller);
    error InvalidTransportStateTransition(string currentStatus, string attemptedStatus);

    error InvalidPurity();  
    error InvalidOutputWeight();
    error MineralAlreadyRefined();
    error ExpectedOutputWeightTooHigh();
    error TargetPurityTooLow();


    error MineralNotListed(string mineralId);
    error MineralAlreadySold(string mineralId);
    error MineralAlreadyListed(string mineralId);
    error InvalidMineralPrice();
    error InvalidFee();
    error TokenNotAccepted(address tokenAddress);
    error UnauthorizedAccess();
    error Invalid__ZeroAddress();
    error TransferFailed();
    error InsufficientPayment(uint256 requiredAmount, uint256 sentAmount);
    error InvalidPayment();
    
}