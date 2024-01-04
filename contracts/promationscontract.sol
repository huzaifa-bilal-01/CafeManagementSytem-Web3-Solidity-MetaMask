// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PromotionsSystem {
    address public owner;
    
    // Promotion structure to store promotion details
    struct Promotion {
        uint256 discountPercentage;
        uint256 expiryTimestamp; // Optional: Set an expiry time for the promotion
    }

    // Mapping to store promotions for each product
    mapping(string => Promotion) public promotions;

    // Event emitted when a new promotion is added
    event PromotionAdded(string productName, uint256 discountPercentage, uint256 expiryTimestamp);

    // Event emitted when a promotion is removed
    event PromotionRemoved(string productName);

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    // Function to add a new promotion
    function addPromotion(string memory productName, uint256 discountPercentage, uint256 expiryTimestamp) external onlyOwner {
        require(discountPercentage > 0 && discountPercentage <= 100, "Invalid discount percentage");
        promotions[productName] = Promotion(discountPercentage, expiryTimestamp);
        emit PromotionAdded(productName, discountPercentage, expiryTimestamp);
    }

    // Function to remove a promotion
    function removePromotion(string memory productName) external onlyOwner {
        delete promotions[productName];
        emit PromotionRemoved(productName);
    }

    // Function to get the discount percentage for a product
    function getDiscountPercentage(string memory productName) external view returns (uint256) {
        if(promotions[productName].discountPercentage > 0){
              return promotions[productName].discountPercentage;
        }
        else{
              return 0;
        }
        
    }
}

