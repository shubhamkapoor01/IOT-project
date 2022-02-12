import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import './App.css';

const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function App() {
  const [userAccount, setUserAccount] = useState('');

  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }

  return (
    <div className="App">
      <button onClick={requestAccount}>
        Connect to wallet
      </button>
    </div>
  );
}

export default App;
