import React from "react";
import Header from "./Header";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import Lock from "./../artifacts/contracts/Lock.sol/Lock.json";
const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;
export default function RevokePermission() {
  const [addressToRevoke, setAddressToRevoke] = React.useState("");
  const [productIdToRevoke, setProductIdToRevoke] = React.useState("");
  const [userAccounts, setUserAccounts] = React.useState([]);
  const requestAccount = async () => {
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((response) => {
        setUserAccounts(response);
      });
  };

  const revokePermission = async () => {
    console.log(productIdToRevoke);
    console.log(addressToRevoke);
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
      await transaction.wait();
      setAddressToRevoke("");
      setProductIdToRevoke("");
    }
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
              onChange={(e) => setProductIdToRevoke(e.target.value)}
              type="text"
              style={{
                width: "400px",
              }}
              placeholder="Enter Room ID of which Permission is to be Revoked"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Wallet Address</Form.Label>
            <Form.Control
              onChange={(e) => setAddressToRevoke(e.target.value)}
              type="text"
              placeholder="Enter Wallet Address of user to Revoke permission"
            />
          </Form.Group>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <Button onClick={() => revokePermission()} variant="primary">
              RevokePermission
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
