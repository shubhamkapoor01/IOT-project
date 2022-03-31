import React, { useEffect, useState } from "react";
import Header from "./Header";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import Lock from "./../artifacts/contracts/Lock.sol/Lock.json";
const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

export default function MyRooms() {
  const [allowed, setAllowed] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [userAccounts, setUserAccounts] = useState([]);
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
  const getAllowed = async (val) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
      try {
        await contract.myPermissions(val[0]).then((result) => {
          setAllowed(result);
          console.log(result);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const requestAccount = async () => {
    let val;
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((response) => {
        setUserAccounts(response);
        val = response;
      });
    if (val !== undefined) {
      getAllowed(val);
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
    }
  };
  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            felx: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "50%",
            marginTop: "10%",
          }}
        >
          <Form>
            <Form.Group>
              <Form.Label>Roomname</Form.Label>
              <Form.Control
                onChange={(e) => setProductName(e.target.value)}
                type="text"
                placeholder="Enter Roomname"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={(e) => setProductDescription(e.target.value)}
                type="text"
                placeholder="Enter Room description"
              />
            </Form.Group>
            <div
              style={{
                marginTop: "10px",
              }}
            >
              <Button variant="primary" onClick={() => createProduct()}>
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
            flexDirection: "column",
            width: "50%",
          }}
        >
          <h2>Your rooms</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            {allowed.map((permission, index) => {
              if (permission !== null) {
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10px",
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                      width: "150px",
                      height: "100px",
                      marginRight: "10px",
                    }}
                  >
                    {permission[0]}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
