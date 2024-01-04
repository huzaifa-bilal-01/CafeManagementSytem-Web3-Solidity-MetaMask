// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoyaltyProgram {
    address public owner;
      address public payment;
    // User structure to store user information
    struct User {
        uint256 points;
        uint256 tier;
    }

    // Mapping to store user details
    mapping(address => User) public users;
    // Event emitted when a user earns points
    event PointsEarned(address indexed user, uint256 points);
    // Event emitted when a user redeems points
    event PointsRedeemed(address indexed user, uint256 points);
    // Event emitted when a user advances to a new tier
    event TierChanged(address indexed user, uint256 newTier);
    // Constructor to set the contract owner
    constructor(address _paymentcontract) {
        owner = msg.sender;
        payment = _paymentcontract;

    }
    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    // Function to allow users to earn points
    function earnPoints(uint256 price) external {
        uint256 points = price/100;
        users[msg.sender].points += points;
        emit PointsEarned(msg.sender, points);

        // Check if the user should advance to a new tier
        checkTier(msg.sender);
    }

    // Function to allow users to redeem points for rewards
    function redeemPoints(uint256 points) external {
        require(users[msg.sender].points >= points, "Insufficient points");
        PaymentContract paymentcontract = PaymentContract(payment);
        users[msg.sender].points -= points;
        paymentcontract.transfer( msg.sender, points);
        emit PointsRedeemed(msg.sender, points);

        // Check if the user should advance to a new tier
        checkTier(msg.sender);
    }

    // Function to check and update the user's tier based on points
    function checkTier(address userAddress) internal {
        uint256 currentPoints = users[userAddress].points;
  if(currentPoints >= 1 && currentPoints < 100){
   // Bronze tier
            if (users[userAddress].tier != 1) {
                users[userAddress].tier = 1;
                emit TierChanged(userAddress, 1);
            }
  }
      else if (currentPoints >= 100 && currentPoints < 200) {
            // Silver tier
            if (users[userAddress].tier != 2) {
                users[userAddress].tier = 2;
                emit TierChanged(userAddress, 2);
            }
        } else if (currentPoints >= 200) {
            // Gold tier
            if (users[userAddress].tier != 3) {
                users[userAddress].tier = 3;
                emit TierChanged(userAddress, 3);
            }
        }
    }

    // Function to get user details
    function getUserDetails(address userAddress) external view returns (uint256, uint256) {
        return (users[userAddress].points, users[userAddress].tier);
    }
}
