import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import './App.css';

const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function App() {
  const [allowed, setAllowed] = useState([]);
  const [owned, setOwned] = useState([]);

  useEffect(() => {
    getAllowed();
    getOwned();
  }, [])

  const getAllowed = async () => {
    const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
    const imAllowedTo = await contract.
  }

  const getOwned = async () => {

  }

  const requestAccount = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }

  return (
    <div className="app">

    </div>
  );
}

export default App;
