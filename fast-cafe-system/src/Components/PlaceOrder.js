import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MenuContractData from "../Contracts/Menu_Management.json"
import Addresses from "../address.json"

export default function PlaceOrder() {
    const MenuABI = MenuContractData.abi;
    const MenuContractAddress = Addresses.MenuContractAddress;
    const ownerAddress = Addresses.Owner;
    return (
        <div>

        </div>
    )
}
