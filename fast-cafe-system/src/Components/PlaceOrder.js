import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MenuContractData from "../Contracts/Menu_Management.json"
import FastCoinsData from "../Contracts/FastCoin.json"
import orderProcessingData from "../Contracts/OrderProcessing.json"
import Addresses from "../address.json"

export default function PlaceOrder() {
    const MenuABI = MenuContractData.abi;
    const FastCoinABI = FastCoinsData.abi;
    const OrderProcessingABI = orderProcessingData.abi;
    const MenuContractAddress = Addresses.MenuContractAddress;
    const FastCoinContractAddress = Addresses.FastCoinContractAddress;
    const OrderProcessingContractAddress = Addresses.OrderProcessingContractAddress;
    const ownerAddress = Addresses.Owner;

    const [menuNames, setMenuNames] = useState([]);
    const [menuPrices, setMenuPrices] = useState([]);
    const [menuAvailabilities, setMenuAvailabilities] = useState([]);

    const [selectedRow, setSelectedRow] = useState(null);

    const [fastCoins, setFastCoins] = useState(0);

    const [userAddress, setUserAddress] = useState("");

    const [addCoins, setAddCoins] = useState(0);

    const [itemQuantity, setItemQuantity] = useState(0);

    const [msg, setMsg] = useState("");

    const updateAddCoins = (value) => {
        setAddCoins(value)
    }

    const handleRowClick = (index) => {
        setSelectedRow(index === selectedRow ? null : index);
    };

    const itemQuantityChange = (event) => {
        setItemQuantity(event.target.value);
    }

    const placeOrder = async () => {
        try {
            const web3 = new Web3('http://127.0.0.1:7545');
            const OrderProcessingContract = new web3.eth.Contract(OrderProcessingABI, OrderProcessingContractAddress);
            const FastCoinsContract = new web3.eth.Contract(FastCoinABI, FastCoinContractAddress);

            const allowance = await OrderProcessingContract.methods.calculateOrderCost(menuNames[selectedRow], itemQuantity).call({ from: userAddress, gas:5000000});
            console.log(allowance)
            const numericAllowance = Number(allowance)
            const check = await FastCoinsContract.methods.approval(OrderProcessingContractAddress, numericAllowance).send({ from:userAddress, gas:5000000})

            const outputMsg = await OrderProcessingContract.methods.placeOrder(menuNames[selectedRow], itemQuantity).send({ from: userAddress, gas: 3000000 });
            console.log(outputMsg);

            const tempTokens = await FastCoinsContract.methods.balanceOf(userAddress).call();
            const balanceAsNumber = Number(tempTokens);
            setFastCoins(balanceAsNumber);
        } catch (error) {
            console.log(error)
        }
    }

    const transferCoins = async () => {
        const web3 = new Web3('http://127.0.0.1:7545');
        const FastCoinsContract = new web3.eth.Contract(FastCoinABI, FastCoinContractAddress);

        await FastCoinsContract.methods.transfer(userAddress, addCoins).send({ from: ownerAddress });

        const tempTokens = await FastCoinsContract.methods.balanceOf(userAddress).call();
        const balanceAsNumber = Number(tempTokens);
        setFastCoins(balanceAsNumber);

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
                const balanceAsNumber = Number(tempTokens);
                setFastCoins(balanceAsNumber);
                console.log(balanceAsNumber);

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
            <div className="input-group w-25">
                <input type="number" className="form-control" id="exampleInputPassword1" value={addCoins} onChange={(e) => { updateAddCoins(e.target.value) }} aria-describedby="button-addon2" />
                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={transferCoins}>Add Coins</button>
            </div>
            <h1>Menu</h1>
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th scope="col">Menu Item</th>
                        <th scope="col">Price</th>
                        <th scope="col">Availability</th>
                    </tr>
                </thead>
                <tbody>
                    {menuNames.map((name, index) => (
                        menuAvailabilities[index] > 0 && (
                            <tr key={index} className={index === selectedRow ? 'table-active' : ''} onClick={() => handleRowClick(index)}>
                                <td>{name}</td>
                                <td>{menuPrices[index]}</td>
                                <td>{menuAvailabilities[index]}</td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
            <div className="input-group mb-3 w-50">
                <span className="input-group-text">Quantity</span>
                <input type="number" className="form-control" id="exampleInputPassword1" value={itemQuantity} onChange={itemQuantityChange} aria-describedby="button-addon2" />
                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={placeOrder}>Place Order</button>
            </div>
            {msg}
        </div>
    )
}
