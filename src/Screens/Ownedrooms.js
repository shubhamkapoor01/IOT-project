import React, { useEffect, useState } from "react";
import Header from "./Header";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import Lock from "./../artifacts/contracts/Lock.sol/Lock.json";
import QRCode from "react-qr-code";
const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

export default function Ownedrooms() {
  const [userAccounts, setUserAccounts] = useState([]);
  const [owned, setOwned] = useState([]);

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
        getOwned(val);
      }
    };
    requestAccount();
  }, []);

  const getOwned = async (val) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
      try {
        await contract.myProducts(val[0]).then((result) => {
          setOwned(result);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Rooms owned by you</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          {owned.map((property) => {
            if (property !== null) {
              return (
                <div
                  className="my-owned-item"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: "3px",
                    borderStyle: "solid",
                    marginRight: "50px",
                    marginLeft: "50px",
                    borderRadius: "5px",
                  }}
                >
                  <h2>{property[0]}</h2>
                  <QRCode
                    value={`https://access-verification-system.herokuapp.com/requesting-access/${property[4]}`}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
