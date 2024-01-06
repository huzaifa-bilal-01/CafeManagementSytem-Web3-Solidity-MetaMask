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

    function placeOrder(string memory itemname, uint256 quantity) external returns (string memory) {
      Menu_Management obj = Menu_Management(menuAddress);
      FastCoin paymentObj = FastCoin(payment);
      (string memory item_Name, uint256 item_Price, uint256 item_Availability) = obj.menu(itemname);
      if (item_Availability <= 0){
        return ("Item out of stock!");
      }
      else if (paymentObj.balanceOf(msg.sender) < item_Price){
        return ("Not enough Fast Coins!");
      }
      
      if (customerOrders[msg.sender][item_Name] == 0){
        customerOrders[msg.sender][item_Name] = quantity;
      }
      else{
        customerOrders[msg.sender][item_Name] += quantity;
      }

      uint256 cost = quantity * item_Price;
      require(paymentObj.transfer(owner, cost), "Transfer Failed");

      LoyaltyProgram loyaltyProgram = LoyaltyProgram(loyalty);
      loyaltyProgram.earnPoints(cost);
     
      (uint256 userPoints, uint256 userTier) = loyaltyProgram.users(msg.sender);
      
      
      PromotionsSystem promotionsSystem = PromotionsSystem(promotionsanddiscount);
      uint256 discountPercentage = promotionsSystem.getDiscountPercentage(item_Name);
      if (discountPercentage > 0){
          uint256 discount = (cost * discountPercentage) / 100;
          require(paymentObj.transferFrom(owner, msg.sender, discount), "Transfer Failed");
      }

      if (userTier == 1) {
        if (discountPercentage > 0) {
          uint256 discount = (cost * (discountPercentage + 10) / 100);
          require(paymentObj.transferFrom(owner, msg.sender, discount), "Transfer Failed");
        }
      }

      if (userTier == 2) {
        if (discountPercentage > 0) {
          uint256 discount = (cost * (discountPercentage + 20) / 100);
          require(paymentObj.transferFrom(owner, msg.sender, discount), "Transfer Failed");
        }
      }

      if (userTier == 3) {
        if (discountPercentage > 0) {
          uint256 discount = (cost * (discountPercentage + 30) / 100);
          require(paymentObj.transferFrom(owner, msg.sender, discount), "Transfer Failed");
        }
      }
      
      return ("Success");
    }
}