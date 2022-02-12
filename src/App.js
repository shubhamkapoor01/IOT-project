import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import './App.css';

function App() {
  const [userAccount, setUserAccount] = useState('');
  const lock = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

  useEffect(() => {
    console.log(lock);
  })

  return (
    <div className="App">

    </div>
  );
}

export default App;
