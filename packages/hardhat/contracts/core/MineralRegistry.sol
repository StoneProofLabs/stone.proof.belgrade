// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { RolesManager } from "../access/RolesManager.sol";
import { Events } from "../utils/Event.sol";
import { Errors } from "../libraries/Errors.sol";
import { MineralUtils } from "../utils/MineralUtils.sol";

/**
 * @title MineralRegistry
 * @author @0xJonaseb11
 * @dev Central registry for mineral information and lifecycle management
 * @notice Handles mineral registration and all updates through a unified interface
 */
contract MineralRegistry is RolesManager {
    
    using MineralUtils for MineralUtils.MineralDetails;
    using MineralUtils for MineralUtils.MineralHistory;

    uint256 private nonce = block.timestamp + block.number;
    mapping(string => MineralUtils.MineralDetails) public mineralDetails;
    mapping(string => MineralUtils.MineralHistory[]) public mineralHistories;


    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier onlyValidMineral(string memory mineralId) {
        if (!isMineralRegistered(mineralId)) {
            revert Errors.MineralRegistry__InvalidMineralIdOrNotFound(mineralId);
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                            MINERAL REGISTRATION
    //////////////////////////////////////////////////////////////*/
    function registerMineral(
        string memory _name,
        string memory _mineralType,
        uint256 _weight,
        string memory _origin,
        uint256 _purityPercentage,
        string memory _storageConditions
    ) external onlyRole(MINER_ROLE) returns (string memory) {
        _validateRegistrationInputs(
            _name,
            _mineralType,
            _weight,
            _origin,
            _purityPercentage,
            _storageConditions
        );

        string memory mineralId = _generateHashedMineralId(_mineralType);
        _createMineralRecord(
            mineralId,
            _name,
            _mineralType,
            _weight,
            _origin,
            _purityPercentage,
            _storageConditions
        );

        return mineralId;
    }

    /*//////////////////////////////////////////////////////////////
                            UNIFIED UPDATE FUNCTION
    //////////////////////////////////////////////////////////////*/
    /**
     * @dev Unified function to update mineral properties
     * @param mineralId The mineral ID to update
     * @param updateType The type of update ("status", "location", "details")
     * @param newValue The new value for the specified field
     * @param additionalData Additional data if needed (for complex updates)
     */
    function updateMineral(
        string memory mineralId,
        string memory updateType,
        string memory newValue,
        bytes memory additionalData
    ) external onlyValidMineral(mineralId) {
        if (keccak256(bytes(updateType)) == keccak256(bytes("status"))) {
            _updateStatus(mineralId, newValue);
        } 
        else if (keccak256(bytes(updateType)) == keccak256(bytes("location"))) {
            _updateLocation(mineralId, newValue);
        }
        else if (keccak256(bytes(updateType)) == keccak256(bytes("details"))) {
            _updateDetails(mineralId, newValue, additionalData);
        }
        else if (keccak256(bytes(updateType)) == keccak256(bytes("inspection"))) {
            _handleInspection(mineralId, string(additionalData));
        }
        else if (keccak256(bytes(updateType)) == keccak256(bytes("audit"))) {
            _handleAudit(mineralId, string(additionalData));
        }
        else {
            revert Errors.MineralRegistry__InvalidUpdateType();
        }
    }

    /*//////////////////////////////////////////////////////////////
                            INTERNAL UPDATE FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _updateStatus(string memory mineralId, string memory newStatus) internal {
        if (!hasRole(REFINER_ROLE, msg.sender) && !hasRole(TRANSPORTER_ROLE, msg.sender)) {
            revert Errors.InsufficientPermissionsToPerformAction(msg.sender);
        }

        mineralDetails[mineralId].currentStatus = newStatus;
        _recordHistory(mineralId, "Status", newStatus);

        emit Events.MineralUpdated(mineralId, newStatus, msg.sender, block.timestamp);
    }

    function _updateLocation(string memory mineralId, string memory newLocation) internal onlyRole(TRANSPORTER_ROLE) {
        mineralDetails[mineralId].currentLocation = newLocation;
        _recordHistory(mineralId, "location", newLocation);

        emit Events.MineralUpdated(mineralId, newLocation, msg.sender, block.timestamp);
    }

    function _updateDetails(string memory mineralId, string memory field, bytes memory data) internal onlyRole(REFINER_ROLE) {

        // Decode additional data based on field
        if (keccak256(bytes(field)) == keccak256(bytes("weight"))) {
            uint256 newWeight = abi.decode(data, (uint256));
            mineralDetails[mineralId].weight = newWeight;
        } 
        else if (keccak256(bytes(field)) == keccak256(bytes("purity"))) {
            uint256 newPurity = abi.decode(data, (uint256));
            mineralDetails[mineralId].purityPercentage = newPurity;
        }
        else {
            revert Errors.MineralRegistry__InvalidDetailField();
        }

        _recordHistory(mineralId, field, string(data));
        emit Events.MineralUpdated(mineralId, field, /*newValue,*/ msg.sender, block.timestamp);
    }

    function _handleInspection(string memory mineralId, string memory inspectionReport) internal onlyRole(INSPECTOR_ROLE) {
        mineralDetails[mineralId].isInspected = true;
        _recordHistory(mineralId, "Inspection", "Completed");
        emit Events.MineralInspected(mineralId, inspectionReport, msg.sender, block.timestamp);
    }

    function _handleAudit(string memory mineralId, string memory auditReport) internal onlyRole(AUDITOR_ROLE) {
        mineralDetails[mineralId].isAudited = true;
        _recordHistory(mineralId, "Audit", "Completed");
        emit Events.MineralAudited(mineralId, auditReport, msg.sender, block.timestamp);
    }

    function _mark_as_market_ready(string memory mineralId) external onlyRole(REFINER_ROLE) {
        if (!mineralDetails[mineralId].isRefined) revert Errors.MineralNotRefined(mineralId);

        (bool isAudited, bool isInspected) = _checkAuditAndInspectionStatus(mineralId);
        
        if (!(isAudited && isInspected)) {
            revert Errors.MineralNotMarketReady(mineralId);
        }

        mineralDetails[mineralId].isMarketReady = true;
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getMineralDetails(
        string memory mineralId
    ) external view onlyValidMineral(mineralId) returns (MineralUtils.MineralDetails memory) {
        return mineralDetails[mineralId];
    }

    function getMineralHistory(
        string memory mineralId
    ) external view onlyValidMineral(mineralId) returns (MineralUtils.MineralHistory[] memory) {
        return mineralHistories[mineralId];
    }

    function isMineralRegistered(string memory mineralId) public view returns (bool) {
        return keccak256(bytes(mineralDetails[mineralId].id)) == keccak256(bytes(mineralId));
    }

    function _checkAuditAndInspectionStatus(
        string memory mineralId
    ) public view onlyValidMineral(mineralId) returns (bool isAudited, bool isInspected) {
        return (mineralDetails[mineralId].isAudited, mineralDetails[mineralId].isInspected);
    }

    /*//////////////////////////////////////////////////////////////
                            INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/
    function _validateRegistrationInputs(
        string memory _name,
        string memory _mineralType,
        uint256 _weight,
        string memory _origin,
        uint256 _purityPercentage,
        string memory _storageConditions
    ) internal pure {
        if (bytes(_name).length == 0) revert Errors.RolesManager__InvalidMineralName();
        if (bytes(_origin).length == 0) revert Errors.RolesManager__InvalidMineralOrigin();
        if (bytes(_mineralType).length == 0) revert Errors.RolesManager__InvalidMineralType();
        if (_weight == 0) revert Errors.RolesManager__InvalidMineralWeight();
        if (_purityPercentage == 0 || _purityPercentage > 100) revert Errors.RolesManager__InvalidMineralPurityPercentage();
        if (_purityPercentage <= 80) revert Errors.RolesManager__MineralPurityPercentageTooLowToRegister(_purityPercentage);
        if (bytes(_storageConditions).length == 0) revert Errors.RolesManager__InvalidMineralStorageConditions();
    }

    function _createMineralRecord(
        string memory mineralId,
        string memory _name,
        string memory _mineralType,
        uint256 _weight,
        string memory _origin,
        uint256 _purityPercentage,
        string memory _storageConditions
    ) internal {
        mineralDetails[mineralId] = MineralUtils.MineralDetails({
            id: mineralId,
            name: _name,
            origin: _origin,
            mineralType: _mineralType,
            weight: _weight,
            purityPercentage: _purityPercentage,
            storageConditions: _storageConditions,
            registeredBy: msg.sender,
            currentStatus: "Raw",
            currentLocation: "Mining Center",
            currentHandler: msg.sender,
            isMarketReady: false,
            isPurchased: false,
            isRefined: false,
            isAudited: false,
            isInspected: false,
            timestamp: block.timestamp
        });

        _recordHistory(mineralId, "Registered", string(abi.encodePacked("Origin: ", _origin)));
        emit Events.MineralRegistered(
            mineralId,
            _name,
            _mineralType,
            _origin,
            _weight,
            _purityPercentage,
            msg.sender,
            block.timestamp
        );
    }

    function _recordHistory(
        string memory mineralId,
        string memory field,
        string memory value
    ) public {
        mineralHistories[mineralId].push(
            MineralUtils.MineralHistory({
                id: mineralId,
                fieldChanged: field,
                newValue: value,
                updatedBy: msg.sender,
                timestamp: block.timestamp
            })
        );
    }

        function registerRefinedMineral(
        MineralUtils.MineralDetails memory inputMineral,
        uint256 outputWeight,
        uint256 achievedPurity,
        address refiner

    ) external onlyRole(REFINER_ROLE) returns(string memory) {
        string memory refinedMineralId = _generateHashedMineralId(inputMineral.mineralType);

        mineralDetails[refinedMineralId] = MineralUtils.MineralDetails({
            id: refinedMineralId,
            name: inputMineral.name,
            origin: inputMineral.origin,
            weight: outputWeight,
            mineralType: inputMineral.mineralType,
            purityPercentage: achievedPurity,
            storageConditions: inputMineral.storageConditions,
            registeredBy: refiner,
            currentStatus: "Refined",
            currentLocation: "Refinery",
            currentHandler: refiner,
            isMarketReady: false,
            isPurchased: false,
            isRefined: true,
            isAudited: false,
            isInspected: false,
            timestamp: block.timestamp
        });
        _recordHistory(refinedMineralId, "Refinery Registry", string(abi.encodePacked("Refined from", inputMineral.origin)));

        return refinedMineralId;
    }

    // helpers

    function _generateHashedMineralId(string memory mineralType) public returns (string memory) {
        bytes32 fullHash = keccak256(abi.encodePacked(mineralType, msg.sender, block.timestamp, nonce++));
        bytes memory shortHex = new bytes(10);
        shortHex[0] = "0";
        shortHex[1] = "x";
        for (uint i = 0; i < 4; i++) {
            shortHex[2 + i * 2] = _nibbleToHexChar(uint8(fullHash[i] >> 4));
            shortHex[3 + i * 2] = _nibbleToHexChar(uint8(fullHash[i] & 0x0f));
        }
        return string(abi.encodePacked(mineralType, "-", string(shortHex)));
    }

    function _nibbleToHexChar(uint8 nibble) internal pure returns (bytes1) {
        return nibble < 10 ? bytes1(nibble + 0x30) : bytes1(nibble + 0x61 - 10);
    }


    // getters 
     function updateMineralAsRefined(string memory mineralId) external {
        if (!hasRefinerRole(msg.sender)) {
            revert Errors.InsufficientPermissionsToPerformAction(msg.sender);
        }
        mineralDetails[mineralId].isRefined = true;
     }

     function updateMineralAfterRefinement(
        string memory mineralId,
        uint256 newWeight,
        uint256 newPurity
     ) external onlyRole(REFINER_ROLE) onlyValidMineral(mineralId) {
        mineralDetails[mineralId].weight = newWeight;
        mineralDetails[mineralId].weight = newPurity;
        mineralDetails[mineralId].isRefined = true;
        mineralDetails[mineralId].currentHandler = msg.sender;

     } 
}
