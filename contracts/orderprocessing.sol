pragma solidity ^0.8.17;
import "./LoyaltyContract.sol";
import "./project2.sol";
import "./promationscontract.sol";

contract OrderProcessing{
    address owner;
    address public menu;
    address public loyalty;
    address public promotionsanddiscount;

    mapping(address=> mapping(string=>uint)) customerpurchase;

    constructor(address _menumanagement,address _loyaltycontract,address _Promotionsanddiscount){
            owner = msg.sender;
            menu = _menumanagement;
            loyalty = _loyaltycontract;
            promotionsanddiscount = _Promotionsanddiscount;
    }

    function placeitem(string memory itemname,uint256 price) public {
      
      LoyaltyProgram loyaltycontract = LoyaltyProgram(loyalty);

        if( customerpurchase[msg.sender][itemname] == 0){
              customerpurchase[msg.sender][itemname]=price;
              loyaltycontract.earnPoints(price);

        }
        else{
              customerpurchase[msg.sender][itemname]+=price;  
              loyaltycontract.earnPoints(price); 
        }
      
        

    }

    
}