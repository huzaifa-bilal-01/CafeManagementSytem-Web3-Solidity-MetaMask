//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface ERC20 {
    function totalSupply() external  view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recepient, uint256 amount) external returns (bool);
    function transferFrom(address sender,address recepient,uint256 amount) external  returns (bool);
    function approval (address spender, uint256 amount) external returns (bool);
    function allowance (address owner, address spender) external view returns (uint256);

    event Transfer(address indexed from,address indexed to,uint256);
    event Approval(address indexed owner,address indexed sender,uint256 amount);
}

contract FastCoin is ERC20 {
    uint myTokens = 100 * (10 ** 18);
    mapping (address=>uint) private balance;
    mapping (address=>mapping (address=>uint)) private approvalLimit;

    constructor () {
        balance[msg.sender] += myTokens;
    }
    function totalSupply() external view returns (uint256) {
        return myTokens;
    }
    function balanceOf(address account) external view returns (uint256) {
        return balance[account];
    }

    function transfer(address recepient, uint256 amount) external returns (bool){
        require(balance[msg.sender]>=amount,"The funds are low");
        balance[msg.sender] -= amount;
        balance [recepient] += amount;
        emit Transfer(msg.sender,recepient, amount);
        return true;
    }

    function approval (address spender, uint256 amount) external returns (bool) {
        require(balance[msg.sender] >=amount, "Funds are low");
        approvalLimit[msg.sender][spender] = amount;
        emit Approval(msg.sender,spender,amount);
        return true;
    }

    function allowance (address owner, address spender) external view returns (uint256){
        return approvalLimit[owner][spender];
    }

    function transferFrom(address sender,address recepient,uint256 amount) external  returns (bool) {
        require(amount<=balance[sender], "funds are low");
        require(amount <= approvalLimit[sender][msg.sender],"funds are low");
        balance[sender] -= amount;
        balance[recepient] += amount;
        approvalLimit[sender][msg.sender] -= amount;
        emit Transfer(sender,recepient,amount);
        return true;
    }


    
}