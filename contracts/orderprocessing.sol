pragma solidity ^0.8.17;
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

    function placeOrder(string memory itemname, uint256 quantity) external{
      Menu_Management menuObj = Menu_Management(menuAddress);
      (uint256 itemPrice, ) = menuObj.menu(itemname);

    }

    
}