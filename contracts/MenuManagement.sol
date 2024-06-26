// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Menu_Management {
    address owner;
    mapping (string => MenuItems) public menu;
    struct MenuItems {
        string name;
        uint256 price;
        uint256 availability;
    }
    string[] public menuItemArr;
    constructor() {
        owner = msg.sender;
    }

    modifier CafeOwner() {
        require(msg.sender==owner, "You are not Cafe Owner :(");
        _;
    }

    function addItems(string memory _name, uint256 _price, uint256 _availability) external CafeOwner {
        require(menu[_name].price==0, "Item already exist");
        menu[_name] = MenuItems(_name,_price,_availability);
        menuItemArr.push(_name);
    }

    function updateItem(string memory _name, uint256 _price, uint256 _availability) external CafeOwner {
        require(menu[_name].price != 0, "Item does not exist");
        menu[_name].price = _price;
        menu[_name].availability = _availability;
    }

    function viewAvailability(string memory _name) external view returns(uint256){
        return menu[_name].availability;
    } 

    function displayMenu() external view returns (string[] memory,uint256[] memory,uint256[] memory) {
        uint256 menu_length = menuItemArr.length;
        string[] memory name = new string[](menu_length);
        uint256[] memory price = new uint256[](menu_length);
        uint256[] memory availabilitiy = new uint256[](menu_length);

        for (uint256 i = 0; i < menu_length; i++) {
            string memory itemName = menuItemArr[i];
            MenuItems memory item = menu[itemName];
            name[i] = item.name;
            price[i] = item.price;
            availabilitiy[i] = item.availability;
        }

        return (name, price, availabilitiy);

    }
}