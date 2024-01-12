import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MenuContractData from "../Contracts/Menu_Management.json"
import FastCoinsData from "../Contracts/FastCoin.json"
import orderProcessingData from "../Contracts/OrderProcessing.json"
import promotions from "../Contracts/PromotionsSystem.json"
import loyaltyData from "../Contracts/LoyaltyProgram.json"
import Addresses from "../address.json"

export default function PlaceOrder() {
    const MenuABI = MenuContractData.abi;
    const FastCoinABI = FastCoinsData.abi;
    const OrderProcessingABI = orderProcessingData.abi;
    const PromotionsABI = promotions.abi;
    const LoyaltyABI = loyaltyData.abi;

    const MenuContractAddress = Addresses.MenuContractAddress;
    const FastCoinContractAddress = Addresses.FastCoinContractAddress;
    const OrderProcessingContractAddress = Addresses.OrderProcessingContractAddress;
    const PromotionsContractAddress = Addresses.PromotionContractAddress;
    const LoyaltyContractAddress = Addresses.LoyaltyContractAddress;
    const ownerAddress = Addresses.Owner;

    const [menuNames, setMenuNames] = useState([]);
    const [menuPrices, setMenuPrices] = useState([]);
    const [menuAvailabilities, setMenuAvailabilities] = useState([]);

    const [menuPromotions, setMenuPromotions] = useState([]);

    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [loyaltyTier, setLoyaltyTier] = useState(0);

    const [selectedRow, setSelectedRow] = useState(null);

    const [fastCoins, setFastCoins] = useState(0);

    const [userAddress, setUserAddress] = useState("");

    const [addCoins, setAddCoins] = useState(0);

    const [itemQuantity, setItemQuantity] = useState(0);

    const [msg, setMsg] = useState("");

    const [billInfo, setBillInfo] = useState(null);

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
            const LoyaltyProgramContract = new web3.eth.Contract(LoyaltyABI, LoyaltyContractAddress);

            const allowance = await OrderProcessingContract.methods.calculateOrderCost(menuNames[selectedRow], itemQuantity).call({ from: userAddress, gas: 5000000 });
            console.log(allowance)
            const numericAllowance = Number(allowance)
            await LoyaltyProgramContract.methods.earnPoints(numericAllowance).send({ from: userAddress, gas:5000000 })
            const check = await FastCoinsContract.methods.approval(OrderProcessingContractAddress, numericAllowance).send({ from: userAddress, gas: 5000000 })

            const outputMsg = await OrderProcessingContract.methods.placeOrder(menuNames[selectedRow], itemQuantity).send({ from: userAddress, gas: 3000000 });
            console.log(outputMsg);

            setMsg(`Order Successful for ${menuNames[selectedRow]} Quantity: ${itemQuantity} || Total Bill: ${numericAllowance} Fast Coins`);

            setBillInfo({
                menuItem: menuNames[selectedRow],
                quantity: itemQuantity,
                totalBill: numericAllowance
            });

            const tempTokens = await FastCoinsContract.methods.balanceOf(userAddress).call();
            const balanceAsNumber = Number(tempTokens);
            setFastCoins(balanceAsNumber);

            const { 0: points, 1: tier } = await LoyaltyProgramContract.methods.getUserDetails(userAddress).call();
            setLoyaltyPoints(Number(points));
            setLoyaltyTier(Number(tier));
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
                const PromotionsContract = new web3.eth.Contract(PromotionsABI, PromotionsContractAddress);
                const LoyaltyProgramContract = new web3.eth.Contract(LoyaltyABI, LoyaltyContractAddress);

                const tempUserAddress = localStorage.getItem('userAddress');
                setUserAddress(tempUserAddress);

                const { 0: points, 1: tier } = await LoyaltyProgramContract.methods.getUserDetails(tempUserAddress).call();
                console.log("Points: ", points);
                console.log("Tier: ", tier);
                setLoyaltyPoints(Number(points));
                setLoyaltyTier(Number(tier));

                const tempTokens = await FastCoinsContract.methods.balanceOf(tempUserAddress).call();
                const balanceAsNumber = Number(tempTokens);
                setFastCoins(balanceAsNumber);
                console.log(balanceAsNumber);

                const { 0: tempNames, 1: tempPrices, 2: tempAvailabilities } = await MenuContract.methods.displayMenu().call();

                setMenuNames(tempNames);
                setMenuPrices(tempPrices.map(Number));
                setMenuAvailabilities(tempAvailabilities.map(Number));

                const tempPromotions = await Promise.all(
                    tempNames.map(async (name) => {
                        const discountPercentage = await PromotionsContract.methods.getDiscountPercentage(name).call();
                        return Number(discountPercentage);
                    })
                );

                console.log(tempPromotions)

                setMenuPromotions(tempPromotions);

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
                        <th scope="col">Loyalty Points: {loyaltyPoints}</th>
                        <th scope="col">Loyalty Tier: {loyaltyTier}</th>
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
                        <th scope="col">Promotion</th>
                    </tr>
                </thead>
                <tbody>
                    {menuNames.map((name, index) => (
                        menuAvailabilities[index] > 0 && (
                            <tr key={index} className={index === selectedRow ? 'table-active' : ''} onClick={() => handleRowClick(index)}>
                                <td>{name}</td>
                                <td>{menuPrices[index]}</td>
                                <td>{menuAvailabilities[index]}</td>
                                <td>{menuPromotions[index]}</td>
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
            {billInfo && (
                <div>
                    <h2>Bill Details</h2>
                    <p>Menu Item: {billInfo.menuItem}</p>
                    <p>Quantity: {billInfo.quantity}</p>
                    <p>Total Bill: {billInfo.totalBill} Fast Coins</p>
                </div>
            )}
        </div>
    )
}
