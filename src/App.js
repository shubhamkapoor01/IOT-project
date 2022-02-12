import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import QrReader from 'react-qr-reader';
import './App.css';

const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function App() {
  const [userAccount, setUserAccount] = useState('');
  const [QrScanResult, setQrScanResult] = useState('');

  const requestAccount = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }

  const handleError = (error) => {
    console.log(error);
  }

  const handleScan = (result) => {
    if (result) {
      setQrScanResult(result);
    }
  }

  return (
    <div className="app">
      <div className="qr-scanner">
        <QrReader 
          onError={ handleError }
          onScan={ handleScan }
        />
        <h3>
          {QrScanResult}
        </h3>
      </div>
    </div>
  );
}

export default App;
