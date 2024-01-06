import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MenuContractData from "../Contracts/Menu_Management.json"
import FastCoinsData from "../Contracts/FastCoin.json"
import Addresses from "../address.json"

export default function PlaceOrder() {
    const MenuABI = MenuContractData.abi;
    const FastCoinABI = FastCoinsData.abi;
    const MenuContractAddress = Addresses.MenuContractAddress;
    const FastCoinContractAddress = Addresses.FastCoinContractAddress;
    const ownerAddress = Addresses.Owner;

    const [menuNames, setMenuNames] = useState([]);
    const [menuPrices, setMenuPrices] = useState([]);
    const [menuAvailabilities, setMenuAvailabilities] = useState([]);

    const [fastCoins, setFastCoins] = useState(0);

    const [userAddress, setUserAddress] = useState("");

    const [addCoins, setAddCoins] = useState(0);

    const updateAddCoins = (value) => {
        setAddCoins(value)
    }

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const web3 = new Web3('http://127.0.0.1:7545');
                const MenuContract = new web3.eth.Contract(MenuABI, MenuContractAddress);
                const FastCoinsContract = new web3.eth.Contract(FastCoinABI, FastCoinContractAddress);

                const tempUserAddress = localStorage.getItem('userAddress');
                setUserAddress(tempUserAddress);

                const tempTokens = await FastCoinsContract.methods.balanceOf(tempUserAddress).call();
                setFastCoins(tempTokens);
                console.log(tempTokens);

                const { 0: tempNames, 1: tempPrices, 2: tempAvailabilities } = await MenuContract.methods.displayMenu().call();

                setMenuNames(tempNames);
                setMenuPrices(tempPrices.map(Number));
                setMenuAvailabilities(tempAvailabilities.map(Number));

                console.log(MenuContract);
            } catch (error) {
                console.log("Error in Loading Contract:", error);
            }
        };

        fetchContracts();
    }, [MenuABI, MenuContractAddress, FastCoinABI, FastCoinContractAddress]);


    return (
        <div className='container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope="col">Address: {userAddress}</th>
                        <th scope="col">Fast Coins: {fastCoins}</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <div className="input-group mb-3">
                <span className="input-group-text">Add Coins</span>
                <input type="number" className="form-control" id="exampleInputPassword1" value={addCoins} onChange={(e)=>{updateAddCoins(e.target.value)}} />
            </div>
        </div>
    )
}
