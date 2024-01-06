//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./LoyaltyContract.sol";
import "./MenuManagement.sol";
import "./promotions.sol";
import "./FastCoin.sol";

contract OrderProcessing{
    address owner;
    address public menuAddress;
    address public loyalty;
    address public promotionsanddiscount;
    address public payment;

    mapping(address=> mapping(string=>uint)) customerOrders;

    constructor(address _menumanagement,address _loyaltycontract,address _Promotionsanddiscount, address _payment){
            owner = msg.sender;
            menuAddress = _menumanagement;
            loyalty = _loyaltycontract;
            promotionsanddiscount = _Promotionsanddiscount;
            payment = _payment;
    }

    function calculateOrderCost(string memory item_Name, uint256 quantity) public returns (uint256) {
    Menu_Management obj = Menu_Management(menuAddress);

    (string memory itemName, uint256 item_Price, uint256 item_Availability) = obj.menu(item_Name);

    if (item_Availability <= 0) {
        revert("Item out of stock!");
    }

    uint256 baseCost = quantity * item_Price;

    LoyaltyProgram loyaltyProgram = LoyaltyProgram(loyalty);
    loyaltyProgram.earnPoints(baseCost);

    (uint256 userPoints, uint256 userTier) = loyaltyProgram.users(msg.sender);

    PromotionsSystem promotionsSystem = PromotionsSystem(promotionsanddiscount);
    uint256 discountPercentage = promotionsSystem.getDiscountPercentage(itemName);

    if (discountPercentage > 0) {
        if (userTier == 1) {
            discountPercentage += 10;
        } else if (userTier == 2) {
            discountPercentage += 20;
        } else if (userTier == 3) {
            discountPercentage += 30;
        }

        uint256 discount = (baseCost * discountPercentage) / 100;
        return baseCost - discount;
    }

    return baseCost;
}

function placeOrder(string memory itemname, uint256 quantity) external returns (string memory) {
    FastCoin paymentObj = FastCoin(payment);

    uint256 totalCost = calculateOrderCost(itemname, quantity);
    require(paymentObj.transferFrom(msg.sender, owner, totalCost), "Transfer Failed");

    return ("Success");
}
}