// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Menu_Management {
    address owner;
    mapping (string => MenuItems) private menu;
    struct MenuItems {
        string name;
        uint256 price;
        bool availability;
    }
    string[] private menuItemArr;
    constructor() {
        owner = msg.sender;
    }

    modifier CafeOwner() {
        require(msg.sender==owner, "You are not Cafe Owner :(");
        _;
    }
    function addItems(string memory _name, uint256 _price, bool _availability) external CafeOwner {
        require(menu[_name].price==0, "Item already exist");
        menu[_name] = MenuItems(_name,_price,_availability);
        menuItemArr.push(_name);
    }

    function displayMenu() external view returns (string[] memory,uint256[] memory,bool[] memory) {
        uint256 menu_length = menuItemArr.length;
        string[] memory name = new string[](menu_length);
        uint256[] memory price = new uint256[](menu_length);
        bool[] memory availabilitiy = new bool[](menu_length);

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