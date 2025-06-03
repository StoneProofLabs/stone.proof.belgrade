// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Errors} from "../libraries/Errors.sol";
import { Events } from "../utils/Event.sol";

/**
 * @title RolesManager Contract
 * @author @0xJonaseb11
 * @notice Centralized role management for the mineral supply chain platform
 * @dev Handles all role assignments and revocations. Other contracts inherit or reference this.
 */
contract RolesManager is AccessControl {

    // using Errors for Errors;
    // using Events for Events;
    /*////////////////////////////////////////////////
                        ROLES
    ////////////////////////////////////////////////*/
    bytes32 public constant MINER_ROLE = keccak256("MINER_ROLE");
    bytes32 public constant REFINER_ROLE = keccak256("REFINER_ROLE");
    bytes32 public constant TRANSPORTER_ROLE = keccak256("TRANSPORTER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
    bytes32 public constant WAREHOUSE_MANAGER_ROLE = keccak256("WAREHOUSE_MANAGER_ROLE");

    
    mapping(bytes32 => uint256) public roleMemberCount;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

        modifier onlyNonZeroAddress(address account) {
        if (account == address(0)) {
            revert Errors.InvalidAccountAddress();
        }
        _;
    }

    /*////////////////////////////////////////////////
                ROLE MANAGEMENT FUNCTIONS
    ////////////////////////////////////////////////*/


 function _setupRole(bytes32 role, address account) internal {
    _grantRole(role, account);

    roleMemberCount[role]++;
}

    // ---------- # One-by-one assignment of roles -------- //

function assignMiner(address account) external onlyNonZeroAddress(account) onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasMinerRole(account)) revert Errors.RolesManager__AccountAlreadyHasRole();
        _grantRole(MINER_ROLE, account);
        roleMemberCount[MINER_ROLE]++;
        emit Events.MinerRoleAssigned(account, block.timestamp);
    }

    function assignRefiner(address account) external onlyNonZeroAddress(account) onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasRefinerRole(account)) revert Errors.RolesManager__AccountAlreadyHasRole();
        _grantRole(REFINER_ROLE, account);
        roleMemberCount[REFINER_ROLE]++;
        emit Events.RefinerRoleAssigned(account, block.timestamp);
    }

    function assignTransporter(address account) external onlyNonZeroAddress(account) onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasTransporterRole(account)) revert Errors.RolesManager__AccountAlreadyHasRole();
        _grantRole(TRANSPORTER_ROLE, account);
        roleMemberCount[TRANSPORTER_ROLE]++;
        emit Events.TransporterRoleAssigned(account, block.timestamp);
    }

    function assignAuditor(address account) external onlyNonZeroAddress(account) onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasAuditorRole(account)) revert Errors.RolesManager__AccountAlreadyHasRole();
        _grantRole(AUDITOR_ROLE, account);
        roleMemberCount[AUDITOR_ROLE]++;
        emit Events.AuditorRoleAssigned(account, block.timestamp);
    }

    function assignInspector(address account) external onlyNonZeroAddress(account) onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasInspectorRole(account)) revert Errors.RolesManager__AccountAlreadyHasRole();
        _grantRole(INSPECTOR_ROLE, account);
        roleMemberCount[INSPECTOR_ROLE]++;
        emit Events.InspectorRoleAssigned(account, block.timestamp);
    }

    function assignBuyer(address account) external onlyNonZeroAddress(account) onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasBuyerRole(account)) revert Errors.RolesManager__AccountAlreadyHasRole();
        _grantRole(BUYER_ROLE, account);
        roleMemberCount[BUYER_ROLE]++;
        emit Events.BuyerRoleAssigned(account, block.timestamp);
    }

    function assignWarehouseManagerRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasWarehouseManagerRole(account)) revert Errors.RolesManager__AccountAlreadyHasRole();
        _grantRole(WAREHOUSE_MANAGER_ROLE, account);
        roleMemberCount[WAREHOUSE_MANAGER_ROLE]++;
        emit Events.WarehouseManagerRoleAssigned(account, block.timestamp);
    }

    // ------- # One-by-one revocation of roles -------- //
     function revokeMiner(address account, string memory reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!hasMinerRole(account)) revert Errors.RolesManager__AccountDoesNotHaveRole();
        revokeRole(MINER_ROLE, account);
        if (roleMemberCount[MINER_ROLE] > 0) {
            roleMemberCount[MINER_ROLE]--;
        }
        emit Events.MinerRoleRevoked(account, reason, block.timestamp);
    }

    function revokeRefiner(address account, string memory reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!hasRefinerRole(account)) revert Errors.RolesManager__AccountDoesNotHaveRole();
        revokeRole(REFINER_ROLE, account);

        if (roleMemberCount[REFINER_ROLE] > 0) {
            roleMemberCount[REFINER_ROLE]--;
        }
        emit Events.RefinerRoleRevoked(account, reason, block.timestamp);
    }

    function revokeTransporter(address account, string memory reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!hasTransporterRole(account)) revert Errors.RolesManager__AccountDoesNotHaveRole();
        revokeRole(TRANSPORTER_ROLE, account);
        if (roleMemberCount[TRANSPORTER_ROLE] > 0) {
            roleMemberCount[TRANSPORTER_ROLE]--;
        }
        emit Events.TransporterRoleRevoked(account, reason, block.timestamp);
    }

    function revokeInspector(address account, string memory reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!hasInspectorRole(account)) revert Errors.RolesManager__AccountDoesNotHaveRole();
        revokeRole(INSPECTOR_ROLE, account);
        if (roleMemberCount[INSPECTOR_ROLE] > 0) {
            roleMemberCount[INSPECTOR_ROLE]--;
        }
        emit Events.InspectorRoleRevoked(account, reason, block.timestamp);
    }

    function revokeAuditor(address account, string memory reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!hasAuditorRole(account)) revert Errors.RolesManager__AccountDoesNotHaveRole();
        revokeRole(AUDITOR_ROLE, account);
        if (roleMemberCount[AUDITOR_ROLE] > 0) {
            roleMemberCount[AUDITOR_ROLE]--;
        }
        emit Events.AuditorRoleRevoked(account, reason, block.timestamp);
    }

    function revokeBuyer(address account, string memory reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!hasBuyerRole(account)) revert Errors.RolesManager__AccountDoesNotHaveRole();
        revokeRole(BUYER_ROLE, account);
        if (roleMemberCount[BUYER_ROLE] > 0) {
            roleMemberCount[BUYER_ROLE]--;
        }
        emit Events.BuyerRoleRevoked(account, reason, block.timestamp);
    }


    function revokeRoleWithReason(
        bytes32 role, 
        address account, 
        string memory reason
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(role, account);
        emit Events.RoleRevoked(role, account, reason, block.timestamp);
    }

    /*////////////////////////////////////////////////
                    VIEW FUNCTIONS and helpers
    ////////////////////////////////////////////////*/
   

    /**
     * @dev Returns the number of accounts that have a specific role
     * @param role The role to query member count for
     * @return count The number of accounts with the role
     */
    function getRoleMemberCount(bytes32 role) public view returns (uint256 count) {
        if (!isValidRole(role)) revert Errors.RolesManager__InvalidRole();
        return roleMemberCount[role];
    }  

      /**
     * @dev Returns all role counts in a single call
     * @return minerCount Number of miners
     * @return refinerCount Number of refiners
     * @return transporterCount Number of transporters
     * @return auditorCount Number of auditors
     * @return inspectorCount Number of inspectors
     * @return buyerCount Number of buyers
     */
    function getAllRoleCounts()
        public
        view
        returns (
            uint256 minerCount,
            uint256 refinerCount,
            uint256 transporterCount,
            uint256 auditorCount,
            uint256 inspectorCount,
            uint256 buyerCount
        )
    {
        return (
            roleMemberCount[MINER_ROLE],
            roleMemberCount[REFINER_ROLE],
            roleMemberCount[TRANSPORTER_ROLE],
            roleMemberCount[AUDITOR_ROLE],
            roleMemberCount[INSPECTOR_ROLE],
            roleMemberCount[BUYER_ROLE]
        );
    }



    /**
     * @dev Returns all roles assigned to a given address
     * @param account The address to check roles for
     * @return roles An array of role names the address has
     */
    function getRolesForAddress(
        address account
    ) public view onlyNonZeroAddress(account) returns (string[] memory roles) {
        // Count how many roles the address has
        uint256 roleCount = 0;

        if (hasRole(DEFAULT_ADMIN_ROLE, account)) roleCount++;
        if (hasRole(MINER_ROLE, account)) roleCount++;
        if (hasRole(REFINER_ROLE, account)) roleCount++;
        if (hasRole(TRANSPORTER_ROLE, account)) roleCount++;
        if (hasRole(AUDITOR_ROLE, account)) roleCount++;
        if (hasRole(INSPECTOR_ROLE, account)) roleCount++;
        if (hasRole(BUYER_ROLE, account)) roleCount++;

        // Initialize array with the counted size
        roles = new string[](roleCount);
        uint256 index = 0;

        // Populate the array with role names
        if (hasRole(DEFAULT_ADMIN_ROLE, account)) {
            roles[index] = "ADMIN";
            index++;
        }
        if (hasRole(MINER_ROLE, account)) {
            roles[index] = "MINER";
            index++;
        }
        if (hasRole(REFINER_ROLE, account)) {
            roles[index] = "REFINER";
            index++;
        }
        if (hasRole(TRANSPORTER_ROLE, account)) {
            roles[index] = "TRANSPORTER";
            index++;
        }
        if (hasRole(AUDITOR_ROLE, account)) {
            roles[index] = "AUDITOR";
            index++;
        }
        if (hasRole(INSPECTOR_ROLE, account)) {
            roles[index] = "INSPECTOR";
            index++;
        }
        if (hasRole(BUYER_ROLE, account)) {
            roles[index] = "BUYER";
            index++;
        }

        return roles;
    }



     function hasMinerRole(address account) public view returns (bool) {
        return hasRole(MINER_ROLE, account);
    }

    function hasRefinerRole(address account) public view returns (bool) {
        return hasRole(REFINER_ROLE, account);
    }

    function hasTransporterRole(address account) public view returns (bool) {
        return hasRole(TRANSPORTER_ROLE, account);
    }

    function hasAuditorRole(address account) public view returns (bool) {
        return hasRole(AUDITOR_ROLE, account);
    }

    function hasInspectorRole(address account) public view returns (bool) {
        return hasRole(INSPECTOR_ROLE, account);
    }

    function hasBuyerRole(address account) public view returns (bool) {
        return hasRole(BUYER_ROLE, account);
    }

    function hasWarehouseManagerRole(address account) public view returns (bool) {
        return hasRole(WAREHOUSE_MANAGER_ROLE, account);
    }


    function isValidRole(bytes32 role) private pure returns (bool) {
        return
            role == MINER_ROLE ||
            role == REFINER_ROLE ||
            role == TRANSPORTER_ROLE ||
            role == AUDITOR_ROLE ||
            role == INSPECTOR_ROLE ||
            role == BUYER_ROLE;
    }

}