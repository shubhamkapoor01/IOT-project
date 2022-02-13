import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import './App.css';

const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function App() {
  const [allowed, setAllowed] = useState([]);
  const [owned, setOwned] = useState([]);
  const [productName, setProductName] = useState(''); 
  const [productDescription, setProductDescription] = useState('');

  useEffect(() => {
    requestAccount();
    getAllowed();
    getOwned();
  }, []);

  const requestAccount = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }

  const getAllowed = async () => {
    const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
    const imAllowedTo = await contract.myPermissions();
    console.log(imAllowedTo);
  }

  const getOwned = async () => {
    const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
    const imOwnerOf = await contract.myProducts();
    console.log(imOwnerOf);
  }

  const addProduct = async () => {
    if (!productName || !productDescription) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      await contract.addProduct(productName, productDescription);
      setProductName('');
      setProductDescription('');
      getAllowed();
      getOwned();  
    }
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
      <div>
        <input 
          placeholder="Enter Name of Product"
          onChange={(e) => setProductName(e.target.value)}
        />
        <input 
          placeholder="Enter Description of Product"
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <button onClick={() => addProduct()}>Add Product</button>
      </div>
    </div>
  );
}

export default App;
