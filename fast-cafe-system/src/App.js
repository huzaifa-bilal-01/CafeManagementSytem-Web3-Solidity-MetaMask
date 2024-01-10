import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Web3 from 'web3';
import MenuManagement from './Components/MenuManagement';
import Login from './Components/Login';
import PlaceOrder from './Components/PlaceOrder';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login></Login>}></Route>
          <Route path='/menuManagement' element={<MenuManagement></MenuManagement>}></Route>
          <Route path='/placeOrder' element={<PlaceOrder></PlaceOrder>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
