// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MineralUtils } from "../utils/MineralUtils.sol";
library Events {

    event RoleAssigned(address indexed account, bytes32 indexed role, uint256 roleAssignedAt);
    event RoleRevoked(bytes32 role, address account, string reason, uint256 roleRevokedAt);

    event MineralRegistered(
        string mineralId,
        string mineralName,
        string mineralType,
        string origin,
        uint256 weight,
        uint256 purityPercentage,
        address indexed miner,
        uint256 registeredAt
    );
    event MineralRefined(string mineralId, uint256 outputWeight, uint256 achievedPurity, address indexed refiner, uint256 refinedAt);
    event MineralTransported(
        string mineralId,
        address indexed transporter,
        address receivingParty,
        string origin,
        string destination,
        uint256 transportedAt
    );
    event MineralUpdated(string mineralId, string field, address updatedBy, uint256 updatedAt);
    event MineralInspected(string mineralId, string inspectionReport, address indexed inspector, uint256 inspectedAt);
    event MineralAudited(string mineralId, string auditReport, address indexed auditor, uint256 auditedAt);
    event MineralPurchased(string mineralId, address indexed buyer, uint256 purchasedAt);
    event MineralReadyToTrade(string mineralId, address inspector_Auditor, string status, uint256 inspectionDate);

    // For every assigned role
    event MinerRoleAssigned(address assignee, uint256 assignedAt);
    event RefinerRoleAssigned(address assignee, uint256 assignedAt);
    event TransporterRoleAssigned(address assignee, uint256 assignedAt);
    event AuditorRoleAssigned(address assignee, uint256 assignedAt);
    event InspectorRoleAssigned(address assignee, uint256 assignedAt);
    event BuyerRoleAssigned(address assignee, uint256 assignedAt);
    event AdminRoleAssigned(address assignee, uint256 assignedAt);
    event WarehouseManagerRoleAssigned(address assignee, uint256 assignedAt);
    // For every revoked role
    event MinerRoleRevoked(address revokee, string reason, uint256 revokedAt);
    event RefinerRoleRevoked(address revokee, string reason, uint256 revokedAt);
    event TransporterRoleRevoked(address revokee, string reason, uint256 revokedAt);
    event AuditorRoleRevoked(address revokee, string reason, uint256 revokedAt);
    event InspectorRoleRevoked(address revokee, string reason, uint256 revokedAt);
    event BuyerRoleRevoked(address revokee, string reason, uint256 revokedAt);
    event AdminRoleRevoked(address revokee, string reason, uint256 revokedAt);

    event MineralRefinementStarted(string indexed inputMineralId, address indexed refiner, uint256 timestamp);
    event MineralRefinementCompleted(string indexed inputMineralId, string indexed outputMineralId, uint256 outputWeight, uint256 newPurity, address indexed refiner, uint256 completedAt);

    event MineralListed(
        string mineralId,
        address indexed seller,
        uint256 ethPrice,
        MineralUtils.TokenPrice[] tokenPrices
    );

    event MineralSold(
        string mineralId,
        address indexed buyer,
        address indexed seller,
        address paymentToken,
        uint256 price,
        uint256 feeAmount

    );

    event MineralDelisted(string mineralId);
    event PaymentTokenAdded(address mineralId);
    event PaymentTokenRemoved(address mineralId);
    event PlatformFeePercentUpdated(uint256 newFeePercent);
    event FeeCollectorUpdated(address newCollector);
    event FundsWithdrawn(address indexed recipient, address token, uint256 amount);
    
}