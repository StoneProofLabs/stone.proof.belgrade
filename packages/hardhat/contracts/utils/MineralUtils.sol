// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library MineralUtils {

      struct MineralDetails {
        string id;
        string name;
        string origin;
        string mineralType;
        uint256 weight;
        uint256 purityPercentage;
        string storageConditions;
        address registeredBy;
        string currentStatus;
        string currentLocation;
        address currentHandler;
        bool isMarketReady;
        bool isPurchased;
        bool isRefined;
        bool isAudited;
        bool isInspected;
        uint256 timestamp;
    }

    struct MineralHistory {
        string id;
        string fieldChanged;
        string newValue;
        address updatedBy;
        uint256 timestamp;
    }

    struct RefinementRecord {
        uint256 batchId;
        string inputMineralId;
        string outputMineralId;
        uint256 inputWeight;
        uint256 outputWeight;
        uint256 purityBefore;
        uint256 purityAfter;
        address refiner;
        uint256 timestamp;
        string processDetails;
    }

    struct MineralSale {
        string mineralId;
        address seller;
        uint256 ethPrice;
        bool isListed;
        bool isSold;
        uint256 listingTimestamp;
        uint256 saleTimestamp;
    }

    struct TokenPrice {
        address token;
        uint256 price;
    }
    
}