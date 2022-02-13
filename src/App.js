import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import './App.css';

const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function App() {
  const [allowed, setAllowed] = useState([]);
  const [owned, setOwned] = useState([]);

  useEffect(() => {
    getAllowed();
    getOwned();
  }, []);

  const getAllowed = async () => {
    const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
    const imAllowedTo = await contract.myPermissions();
    setAllowed(imAllowedTo);
    console.log(allowed);
  }

  const getOwned = async () => {
    const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
    const imOwnerOf = await contract.myProducts();
    setOwned(imOwnerOf);
    console.log(owned);
  }

  const requestAccount = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }

  return (
    <div className="app">
      <div className="my-allowed">
        <h2>Allowed</h2>
          {allowed.map((permission) => {
          return (
            <div className="my-allowed">
              {permission}
            </div>
          )
        })}
      </div>

      <div className="my-owned">
        <h2>Owned</h2>
        {owned.map((property) => {
          return (
            <div className="my-owned">
              {property}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
