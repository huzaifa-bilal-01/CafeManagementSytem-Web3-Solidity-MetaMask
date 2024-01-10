import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MenuContractData from "../Contracts/Menu_Management.json"
import PromotionsData from "../Contracts/PromotionsSystem.json"
import Addresses from "../address.json"

export default function MenuManagement() {
    const MenuABI = MenuContractData.abi;
    const PromotionsABI = PromotionsData.abi;
    // const MenuContractAddress = "0xc268F46863A88257a935D246C59BDcb82E51c9Dc";
    // const FastCoinContractAddress = "0xdb51E30cB9b130C4D76F50E7BB4CC1a1DbeA6A16";
    // const PromotionContractAddress = "0xd98634A7c880C5fF1d1373bb86a36c5F8df2A0AE";
    // const LoyaltyContractAddress = "0x101d661B762Aaa90F3C728f5B78f8BC33Da4D77E";
    // const OrderProcessingContractAddress = "0x0E7f4Fd494946DA87C626C2De342e6E4Cf8b0a4f";
    const MenuContractAddress = Addresses.MenuContractAddress;
    const PromotionsContractAddress = Addresses.PromotionContractAddress;
    const ownerAddress = Addresses.Owner;

    const [menuNames, setMenuNames] = useState([]);
    const [menuPrices, setMenuPrices] = useState([]);
    const [menuAvailabilities, setMenuAvailabilities] = useState([]);

    const [promotionDiscounts, setPromotionDiscounts] = useState([]);

    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const [itemQuantity, setItemQuantity] = useState(0);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const web3 = new Web3('http://127.0.0.1:7545');
                const MenuContract = new web3.eth.Contract(MenuABI, MenuContractAddress);
                const PromotionsContract = new web3.eth.Contract(PromotionsABI, PromotionsContractAddress);


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

                setPromotionDiscounts(tempPromotions);

                console.log(MenuContract);
            } catch (error) {
                console.log("Error in Loading Contract:", error)
            }
        }

        fetchContracts();
    }, [MenuABI, MenuContractAddress]);

    const itemNameChange = (event) => {
        setItemName(event.target.value);
    }

    const itemPriceChange = (event) => {
        setItemPrice(event.target.value);
    }

    const itemQuantityChange = (event) => {
        setItemQuantity(event.target.value);
    }

    const AddItem = async () => {
        const web3 = new Web3('http://127.0.0.1:7545');
        const MenuContract = new web3.eth.Contract(MenuABI, MenuContractAddress)
        try {
            await MenuContract.methods.addItems(itemName, itemPrice, itemQuantity).send({ from: ownerAddress, gas: 5000000 });
            const { 0: tempNames, 1: tempPrices, 2: tempAvailabilities } = await MenuContract.methods.displayMenu().call();

            setMenuNames(tempNames);
            setMenuPrices(tempPrices.map(Number));
            setMenuAvailabilities(tempAvailabilities.map(Number));

            setItemName("");
            setItemPrice(0);
            setItemQuantity(0);
        } catch (error) {
            console.log(error)
        }
    }

    const updatePrice = (index, newPrice) => {
        const updatedPrices = [...menuPrices];
        updatedPrices[index] = newPrice;
        setMenuPrices(updatedPrices);
    };

    const updateAvailability = (index, newAvailability) => {
        const updatedAvailabilities = [...menuAvailabilities];
        updatedAvailabilities[index] = newAvailability;
        setMenuAvailabilities(updatedAvailabilities);
    };

    const promotionDiscountChange = (index, event) => {
        const updatedDiscounts = [...promotionDiscounts];
        updatedDiscounts[index] = event.target.value;
        setPromotionDiscounts(updatedDiscounts);
    };

    const addPromotion = async (itemName, discount) => {
        const web3 = new Web3('http://127.0.0.1:7545');
        const PromotionsContract = new web3.eth.Contract(PromotionsABI, PromotionsContractAddress);

        try {
            console.log(`Adding promotion for ${itemName} with discount ${discount}`);
            // Assuming your PromotionsContract has an addPromotion function
            await PromotionsContract.methods.addPromotion(itemName, discount, 0).send({ from: ownerAddress });
            console.log(`Promotion for ${itemName} added successfully`);
        } catch (error) {
            console.log(error);
        }
    };

    const updateMenu = async () => {
        const web3 = new Web3('http://127.0.0.1:7545');
        const MenuContract = new web3.eth.Contract(MenuABI, MenuContractAddress);

        try {
            for (let i = 0; i < menuNames.length; i++) {
                const tempItemName = menuNames[i];
                const tempItemPrice = menuPrices[i];
                const tempItemAvailability = menuAvailabilities[i];
                const tempPromotionDiscount = promotionDiscounts[i];

                await MenuContract.methods.updateItem(tempItemName, tempItemPrice, tempItemAvailability).send({ from: ownerAddress });

                // If a promotion discount is provided, add/update the promotion
                if (tempPromotionDiscount > 0) {
                    await addPromotion(tempItemName, tempPromotionDiscount);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='container'>
            <h2>Menu Management</h2>
            <div className="card w-25">
                <div className="card-body">
                    <h5>Add Item</h5>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Item Name</span>
                        <input type="text" className="form-control" id="exampleInputEmail1" value={itemName} onChange={itemNameChange} />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Price</span>
                        <span className="input-group-text">PKR</span>
                        <input type="number" className="form-control" id="exampleInputPassword1" value={itemPrice} onChange={itemPriceChange} />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Quantity</span>
                        <input type="number" className="form-control" id="exampleInputPassword1" value={itemQuantity} onChange={itemQuantityChange} />
                    </div>
                    <button type="button" className="btn btn-outline-dark" onClick={AddItem}>Add Item</button>
                </div>
            </div>

            {menuNames.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Item Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Promotion Discount</th>
                            <th scope="col"><button type="button" className="btn btn-outline-primary" onClick={updateMenu}>Update</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuNames.map((name, index) => (
                            <tr key={index}>
                                <td>{name}</td>
                                <td>
                                    <div className="input-group">
                                        <span className="input-group-text">PKR</span>
                                        <input type="number" className="form-control" id="exampleInputPassword1" value={menuPrices[index]} onChange={(e) => updatePrice(index, e.target.value)} />
                                    </div>
                                </td>
                                <td>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={menuAvailabilities[index]}
                                            onChange={(e) => updateAvailability(index, e.target.value)}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={promotionDiscounts[index]}
                                            onChange={(e) => promotionDiscountChange(index, e)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    )
}
