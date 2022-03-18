import React, { useState, useEffect } from 'react'
import Lock from './artifacts/contracts/Lock.sol/Lock.json';
import { ethers } from 'ethers';

const lockAddress = process.env.REACT_APP_CONTRACT_LOCK_ADDRESS;

function RequestingAccess(props) {
	const [hasAccess, setHasAccess] = useState(0);
	const [userAccounts, setUserAccounts] = useState([]);

  const requestAccount = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'})
    .then((response) => {
      setUserAccounts(response);
    });
  }

	const showAllowed = async (userToCheckAllowed) => {
		if (typeof window.ethereum !== 'undefined') {
			const url = window.location.href;
			const roomId = url.substring(url.lastIndexOf('/') + 1);
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(lockAddress, Lock.abi, provider);
			try {
				await contract.isAllowed(roomId, userToCheckAllowed).then((result) => {
					result ? setHasAccess(1) : setHasAccess(2);
				});
			} catch (error) {
				console.log(error);
			}
		} 
	}

	useEffect(() => {
		if (props.userAccounts[0] !== undefined) {
			showAllowed(props.userAccounts[0]);
		} else {
			requestAccount().then(() => {
				showAllowed(userAccounts[0]).then(alert(userAccounts[0]));
			});
		}
	}, [userAccounts, props.userAccounts]);

	return (
		<div>
			{hasAccess === 0 ? (
				<div>
					<div>Loading...</div>
					{userAccounts[0] === undefined ? (
						 <div>Account not connected</div>
					) : (
						 <div>Account connected</div>
					)}
				</div>
			) : (
				hasAccess === 1 ? (
					<div>ACCESS GRANTED</div>
				) : (
					<div>ACCESS DENIED</div>
				)
			)}
		</div>
	)
}

export default RequestingAccess;
