import React, { useState, useEffect } from 'react'
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import { ethers } from 'ethers';

const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function RequestingAccess() {
	const [hasAccess, setHasAccess] = useState(0);
	const [userAccounts, setUserAccounts] = useState([]);

	const requestAccount = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'})
    .then((response) => {
      setUserAccounts(response);
    });
	}

	const showAllowed = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const url = window.location.href;
			const roomId = url.substring(url.lastIndexOf('/') + 1);
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
			try {
				await contract.isAllowed(roomId, userAccounts[0]).then((result) => {
					result ? setHasAccess(1) : setHasAccess(2);
				});
			} catch (error) {
				console.log(error);
			}
		}
	}

	useEffect(() => {
		requestAccount().then((response) => {
      if (userAccounts[0] !== undefined) {
        showAllowed();
      }
    })
	}, [userAccounts]);

	return (
		<div>
			{hasAccess == 0 ? (
				<div>Loading...</div>
			) : (
				hasAccess == 1 ? (
					<div>ACCESS GRANTED</div>
				) : (
					<div>ACCESS DENIED</div>
				)
			)}
		</div>
	)
}

export default RequestingAccess;