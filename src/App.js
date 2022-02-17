import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import QRCode from 'react-qr-code'
import './App.css';

const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function App() {
  const [userAccounts, setUserAccounts] = useState([]);
  const [allowed, setAllowed] = useState([]);
  const [owned, setOwned] = useState([]);
  const [productName, setProductName] = useState(''); 
  const [productDescription, setProductDescription] = useState('');
  const [addressToGrant, setAddressToGrant] = useState('');
  const [productIdToGrant, setProductIdToGrant] = useState('');
  const [addressToRevoke, setAddressToRevoke] = useState('');
  const [productIdToRevoke, setProductIdToRevoke] = useState('');
  const [addressToTransfer, setAddressToTransfer] = useState('');
  const [productIdToTransfer, setProductIdToTransfer] = useState('');

  useEffect(() => {
    requestAccount().then((response) => {
      if (userAccounts[0] !== undefined) {
          getAllowed();
          getOwned();
      }
    });
  }, [userAccounts]);

  const requestAccount = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'})
    .then((response) => {
      setUserAccounts(response);
    });
  }

  const getAllowed = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
      try {
        await contract.myPermissions(userAccounts[0]).then((result) => {
          setAllowed(result);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const getOwned = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
      try {
        await contract.myProducts(userAccounts[0]).then((result) => {
          setOwned(result);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const doIOwn = async (productId) => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider);

      try {
        await contract.checkOwner(productId, userAccounts[0]).then((result) => console.log(result));
      } catch (error) {
        console.log(error);
      }
    }
  }

  const createProduct = async () => {
    if (!productName || !productDescription) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.addProduct(productName, userAccounts[0], productDescription);
      setProductName('');
      setProductDescription('');
      await transaction.wait();
      getAllowed();
      getOwned();  
    }
  }

  const grantPermission = async () => {
    if (!addressToGrant || !productIdToGrant) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.grantPermission(productIdToGrant, userAccounts[0], addressToGrant);
      setProductName('');
      setProductDescription('');
      await transaction.wait()
      setAddressToGrant('');
      setProductIdToGrant('');
    }
  }

  const revokePermission = async () => {
    if (!addressToRevoke || !productIdToRevoke) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.revokePermission(productIdToRevoke, userAccounts[0], addressToRevoke);
      setProductName('');
      setProductDescription('');
      await transaction.wait()
      setAddressToRevoke('');
      setProductIdToRevoke('');
    }
  }

  const transferOwnership = async () => {
    if (!addressToTransfer || !productIdToTransfer) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.transferOwnership(productIdToTransfer, userAccounts[0], addressToTransfer);
      setProductName('');
      setProductDescription('');
      await transaction.wait()
      setAddressToTransfer('');
      setProductIdToTransfer('');
    }
  }

  return (
    <div className="app">
      <div className="my-allowed">
        <h2>Allowed</h2>
          {allowed.map((permission) => {
            if (permission !== null) {
              return (
                <div className="my-allowed-item">
                  {permission[0]}
                </div>
              )
            }
        })}
      </div>
      <div className="my-owned">
        <h2>Owned</h2>
        {owned.map((property) => {
          if (property !== null) {
            return (
              <div className="my-owned-item">
                {property[0]}
                <QRCode 
                  value={`${window.location.href}/requesting-access/${property[4]}`}
                />
              </div>
            )
          }
        })}
      </div>
      <div className="add-new-room">
        <input 
          placeholder="Enter Room Name"
          onChange={(e) => setProductName(e.target.value)}
        />
        <input 
          placeholder="Enter Room Description"
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <button onClick={() => createProduct()}>Add New Room</button>
      </div>
      <div className="grant-permission">
        <input 
          placeholder="Enter Room ID of which Permission is to be Granted"
          onChange={(e) => setProductIdToGrant(e.target.value)}
        />
        <input
          placeholder="Enter Wallet Address of user to grant permission"
          onChange={(e) => setAddressToGrant(e.target.value)}
        />
        <button onClick={() => grantPermission()}>Grant Permission</button>
      </div>
      <div className="revoke-permission">
        <input 
          placeholder="Enter Room ID of which Permission is to be Revoked"
          onChange={(e) => setProductIdToRevoke(e.target.value)}
        />
        <input
          placeholder="Enter Wallet Address of user to Revoke permission"
          onChange={(e) => setAddressToRevoke(e.target.value)}
        />
        <button onClick={() => revokePermission()}>Revoke Permission</button>
      </div>
      <div className="transfer-ownership">
        <input 
          placeholder="Enter Room ID of which Ownership is to be Transfered"
          onChange={(e) => setProductIdToTransfer(e.target.value)}
        />
        <input
          placeholder="Enter Wallet Address of user to Transfer Ownership"
          onChange={(e) => setAddressToTransfer(e.target.value)}
        />
        <button onClick={() => transferOwnership()}>Transfer Ownership</button>
      </div>
    </div>
  );
}

export default App;