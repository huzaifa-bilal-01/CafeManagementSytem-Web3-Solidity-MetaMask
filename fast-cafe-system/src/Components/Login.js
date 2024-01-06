import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

export default function Login() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const updateName = (name) => {
        setName(name)
    }

    const updateAddress = (address) => {
        setAddress(address);
    }

    const verifyLogin = async () => {
        const web3 = new Web3('http://localhost:7545');
        const accounts = await web3.eth.getAccounts();

        if (accounts.includes(address)) {
            console.log("Login successful!");
        } else {
            console.log("Login failed. Address not found on the blockchain.");
        }
        
    }

    return (
        <div className='container center'>
            <div className="card">
                <div className="card-body">
                    <div className="input-group mb-3">
                        <span className="input-group-text">Name</span>
                        <input type="text" className="form-control" id="exampleInputEmail1" value={name} onChange={(e) => updateName(e.target.value)} />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Blockchain Address</span>
                        <input type="text" className="form-control" id="exampleInputEmail1" value={address} onChange={(e) => updateAddress(e.target.value)} />
                    </div>
                    <button type="button" className="btn btn-outline-dark" onClick={verifyLogin}>Login</button>
                </div>
            </div>
        </div>
    )
}
