pragma solidity ^0.8.17;

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

    function placeitem(string memory itemname,uint256 price) public returns(string){
      
      LoyaltyContract loyaltycontract = LoyaltyContract(loyalty);

        if( customerpurchase[msg.sender][itemname] == 0){
              customerpurchase[msg.sender][itemname]=price;
              loyaltycontract.earnPoints(price);

        }
        else{
              customerpurchase[msg.sender][itemname]+=price;  
              loyaltycontract.earnPoints(price); 
        }
      
        

    }

    function getTotalPrice(string memory itemname,uint256 quantity) public returns (uint256){
             Menumanagement menumanagement = Menumanagement(menu);
             Promotionsanddiscount promotionanddiscount = promotionsanddiscount(promotionsanddiscount);
             uint256 itemslength = menumanagement.getitemcount();
           uint256 totalprice;
             for(uint256 i = 0; i<itemslength; i++){
                if( menumanagement.items[i].name == itemname ){
                      uint256 discount = promotionanddiscount.getDiscountPercentage(menumanagement.items[i].name);
                      totalprice = menumanagement.items[i].price;
                      totalprice = totalprice * quantity; 
                      if(discount > 0){
                      discount = discount / 100;
                      discount = totalprice * discount;
                      totalprice -= discount;
                       return totalprice;
                      }
                      else{
                          return totalprice;
                      }
                     
                }        
             }

    }
}