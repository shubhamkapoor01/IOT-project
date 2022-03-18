import React, { useEffect, useState } from "react";
import Header from "./Header";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import Lock from "./../artifacts/contracts/Lock.sol/Lock.json";
const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

export default function GrantPermission() {
  const [addressToGrant, setAddressToGrant] = React.useState("");
  const [productIdToGrant, setProductIdToGrant] = React.useState("");
  const [userAccounts, setUserAccounts] = React.useState([]);

  const grantPermission = async () => {
    if (!addressToGrant || !productIdToGrant) {
      alert("Input Feilds Cannot Be Empty");
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      console.log("hy");
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(lockAddress, Lock.abi, signer);
      const transaction = await contract.grantPermission(
        productIdToGrant,
        userAccounts[0],
        addressToGrant
      );
      await transaction.wait();
      setAddressToGrant("");
      setProductIdToGrant("");
    }
  };
  const requestAccount = async () => {
    let val;
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
            <Form.Label>Room ID</Form.Label>
            <Form.Control
              onChange={(e) => setProductIdToGrant(e.target.value)}
              type="text"
              placeholder="Enter Room ID of which Permission is to be Granted"
              style={{
                width: "400px",
              }}
           />
          </Form.Group>
          <Form.Group>
            <Form.Label>Wallet Address</Form.Label>
            <Form.Control
              onChange={(e) => setAddressToGrant(e.target.value)}
              type="text"
              placeholder="Enter Wallet Address of user to grant permission"
            />
          </Form.Group>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <Button variant="primary" onClick={() => grantPermission()}>
              Create Room
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
