import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Lock from "./artifacts/contracts/Lock.sol/Lock.json";
import QRCode from "react-qr-code";
import "./App.css";
import Header from "./Screens/Header";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function App() {
  const [userAccounts, setUserAccounts] = useState([]);
  const [owned, setOwned] = useState([]);
  const [allowed, setAllowed] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [addressToGrant, setAddressToGrant] = useState("");
  const [productIdToGrant, setProductIdToGrant] = useState("");
  const [addressToRevoke, setAddressToRevoke] = useState("");
  const [productIdToRevoke, setProductIdToRevoke] = useState("");
  const [addressToTransfer, setAddressToTransfer] = useState("");
  const [productIdToTransfer, setProductIdToTransfer] = useState("");

  useEffect(() => {
    const requestAccount = async () => {
      let val;
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((response) => {
          setUserAccounts(response);
          val = response;
        });
      if (val[0] !== undefined) {
        getAllowed(val);
      }
    };
    requestAccount();
  }, []);

  // const requestAccount = async () => {
  //   await window.ethereum
  //     .request({ method: "eth_requestAccounts" })
  //     .then((response) => {
  //       setUserAccounts(response);
  //     });
  // };
  const requestAccount = async () => {
    let val;
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((response) => {
        setUserAccounts(response);
        val = response;
      });
    if (val !== undefined) {
      getAllowed();
    }
  };

  const getAllowed = async (val) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
      try {
        await contract.myPermissions(val[0]).then((result) => {
          setAllowed(result);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getOwned = async () => {
    if (typeof window.ethereum !== "undefined") {
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
  };

  const doIOwn = async (productId) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider);

      try {
        await contract
          .checkOwner(productId, userAccounts[0])
          .then((result) => console.log(result));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createProduct = async () => {
    if (!productName || !productDescription) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.addProduct(
        productName,
        userAccounts[0],
        productDescription
      );
      setProductName("");
      setProductDescription("");
      await transaction.wait();
      getAllowed();
      getOwned();
    }
  };

  const grantPermission = async () => {
    if (!addressToGrant || !productIdToGrant) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.grantPermission(
        productIdToGrant,
        userAccounts[0],
        addressToGrant
      );
      setProductName("");
      setProductDescription("");
      await transaction.wait();
      setAddressToGrant("");
      setProductIdToGrant("");
    }
  };

  const revokePermission = async () => {
    if (!addressToRevoke || !productIdToRevoke) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.revokePermission(
        productIdToRevoke,
        userAccounts[0],
        addressToRevoke
      );
      setProductName("");
      setProductDescription("");
      await transaction.wait();
      setAddressToRevoke("");
      setProductIdToRevoke("");
    }
  };

  const transferOwnership = async () => {
    if (!addressToTransfer || !productIdToTransfer) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.transferOwnership(
        productIdToTransfer,
        userAccounts[0],
        addressToTransfer
      );
      setProductName("");
      setProductDescription("");
      await transaction.wait();
      setAddressToTransfer("");
      setProductIdToTransfer("");
    }
  };
  
  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            margin: "10px",
          }}
        >
          <Link to="myrooms">
            <Button variant="success">Allowed</Button>
          </Link>
        </div>
        <div
          style={{
            margin: "10px",
          }}
        >
          <Link to="ownedrooms">
            <Button variant="primary">Owned</Button>
          </Link>
        </div>
        <div
          style={{
            margin: "10px",
          }}
        >
          <Button variant="danger">Revoke Permissions</Button>
        </div>
        <div
          style={{
            margin: "10px",
          }}
        >
          <Link to="previleges">
            <Button variant="warning">Transfer Ownership</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
