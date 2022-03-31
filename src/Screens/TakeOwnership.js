import React from "react";
import Header from "./Header";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import Lock from "./../artifacts/contracts/Lock.sol/Lock.json";
const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

export default function TakeOwnership() {
  const [addressToTransfer, setAddressToTransfer] = React.useState("");
  const [productIdToTransfer, setProductIdToTransfer] = React.useState("");
  const [userAccounts, setUserAccounts] = React.useState([]);
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

      await transaction.wait();
      setAddressToTransfer("");
      setProductIdToTransfer("");
    }
  };
  const requestAccount = async () => {
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((response) => {
        setUserAccounts(response);
      });
  };
  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form>
          <Form.Group>
            <Form.Label> Room ID </Form.Label>
            <Form.Control
              onChange={(e) => setProductIdToTransfer(e.target.value)}
              type="text"
              style={{
                width: "400px",
              }}
              placeholder="Enter Romm Id of user to Transfered Ownership"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Wallet Address</Form.Label>
            <Form.Control
              onChange={(e) => setAddressToTransfer(e.target.value)}
              type="text"
              placeholder="Enter  Wallet Address of user to Transfered Ownership"
            />
          </Form.Group>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <Button onClick={() => transferOwnership()} variant="primary">
              Take Ownership
            </Button>
          </div>
        </Form>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      ></div>
    </div>
  );
}
