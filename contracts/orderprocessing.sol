//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./LoyaltyContract.sol";
import "./project2.sol";
import "./promationscontract.sol";

contract OrderProcessing{
    address owner;
    address public menuAddress;
    address public loyalty;
    address public promotionsanddiscount;

    mapping(address=> mapping(string=>uint)) customerpurchase;

    constructor(address _menumanagement,address _loyaltycontract,address _Promotionsanddiscount){
            owner = msg.sender;
            menuAddress = _menumanagement;
            loyalty = _loyaltycontract;
            promotionsanddiscount = _Promotionsanddiscount;
    }

    function placeOrder(string memory itemname, uint256 quantity) external {
      Menu_Management obj = Menu_Management(menuAddress);
      (string memory item_Name, uint256 item_Price, uint256 item_Availability) = obj.menu(itemname);
    }
}