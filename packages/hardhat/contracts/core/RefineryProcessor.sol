// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MineralRegistry } from "./MineralRegistry.sol";
import { MineralUtils } from "../utils/MineralUtils.sol"; 
import { Errors } from "../libraries/Errors.sol";   
import { Events } from "../utils/Event.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

contract RefineryProcessor {
    MineralRegistry public immutable mineralRegistry;   

    using MineralUtils for MineralUtils.MineralDetails;
    using MineralUtils for MineralUtils.RefinementRecord;

    mapping(string => MineralUtils.RefinementRecord) public refinementRecords;

    constructor(address _mineralRegistry) {
        mineralRegistry = MineralRegistry(_mineralRegistry);
    }

    modifier onlyRegisteredMineral(string memory mineralId) {
        if (!mineralRegistry.isMineralRegistered(mineralId)) {
            revert Errors.MineralRegistry__InvalidMineralIdOrNotFound(mineralId);
        }
        _;
    }

    modifier onlyRefiner() {
        if (!mineralRegistry.hasRefinerRole(msg.sender)) {
            revert Errors.InsufficientPermissionsToPerformAction(msg.sender);
        }
        _;
    }

    /**
    * @dev Unified function to refine minerals
    * @param mineralId The mineral ID to refine
    * @param outputWeight Resulting weight after refinement
    * @param achievedPurity Resulting purity percentage
    * @param processDetails Details about refinement process
    */
    function refineMineral(
        string memory mineralId,
        uint256 outputWeight,
        uint256 achievedPurity,
        string memory processDetails
    ) external onlyRefiner onlyRegisteredMineral(mineralId) {
        MineralUtils.MineralDetails memory mineral = mineralRegistry.getMineralDetails(mineralId);

        // Validate refinement parameters
        if (mineral.isRefined) {
            revert Errors.MineralAlreadyRefined();
        }
        if (outputWeight > mineral.weight) {
            revert Errors.InvalidOutputWeight();
        }
        if (achievedPurity < mineral.purityPercentage) {
            revert Errors.InvalidPurity();
        }

        // Update mineral properties in registry
        mineralRegistry.updateMineralAfterRefinement(
            mineralId,
            outputWeight,
            achievedPurity
        );

        refinementRecords[mineralId] = MineralUtils.RefinementRecord({
            batchId: uint256(keccak256(abi.encodePacked(mineralId, block.timestamp))),
            inputMineralId: mineralId,
            outputMineralId: mineralId, // Same mineral ID
            inputWeight: mineral.weight,
            outputWeight: outputWeight,
            purityBefore: mineral.purityPercentage,
            purityAfter: achievedPurity,
            refiner: msg.sender,
            timestamp: block.timestamp,
            processDetails: processDetails
        });

        mineralRegistry._recordHistory(
            mineralId,
            "Refinement",
            string(abi.encodePacked(
                "Weight: ", Strings.toString(outputWeight), 
                ", Purity: ", Strings.toString(achievedPurity), "%"
            ))
        );

        emit Events.MineralRefined(
            mineralId,
            outputWeight,
            achievedPurity,
            msg.sender,
            block.timestamp
        );
    }

    /**
    * @dev Get refinement record for a mineral
    * @param mineralId The mineral ID to check
    * @return Refinement record
    */
    function getRefinementRecord(
        string memory mineralId
    ) external view returns (MineralUtils.RefinementRecord memory) {
        return refinementRecords[mineralId];
    }
}