import { useCallback, useEffect, useState } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.css";
import web3 from "./web3";
import lottery from "./lottery";

import car from "./car.png";
import phone from "./phone.png";
import computer from "./computer.png";
function App() {
	const [owner, setOwner] = useState();
	const [owner2, setOwner2] = useState();
	const [account, setAccount] = useState();
	const [contractBalance, setContractBalance] = useState();
	const [itemsWon, setItemsWon] = useState();

	const [carTokens, setCarTokens] = useState();
	const [phoneTokens, setPhoneTokens] = useState();
	const [computerTokens, setComputerTokens] = useState();

	// console.log(lottery);

	// Get the owner of the contract
	useEffect(() => {
		async function getContractOwners() {
			const owner = await lottery.methods.owner().call();
			setOwner(owner);
			const owner2 = await lottery.methods.owner2().call();
			setOwner2(owner2);
		}
		getContractOwners();
	}, [owner, owner2]);

	// when the app loads, get the user's account

	async function getAccount() {
		await web3.eth.getAccounts().then((accounts) => {
			setAccount(accounts[0]);
		});
		window.ethereum.on("accountsChanged", (accounts) =>
			setAccount(accounts[0])
		);
	}

	useEffect(() => {
		// Update the account on change
		getAccount();
		// Update the contract balance on change
		getContractBalance();
		// Update the items tokens on change
		getTokens();
		// Update the items won on change
		setItemsWon();
	}, [account]);

	useEffect(() => {
		// set interval to update the contract balance
		setInterval(() => {
			getContractBalance();
			getTokens();
		}, 100);
	}, []);
	// Update the contract balance on change
	async function getContractBalance() {
		await web3.eth.getBalance(lottery.options.address).then((balance) => {
			setContractBalance(web3.utils.fromWei(balance, "ether"));
		});
	}

	// Update the tokens for each item on change
	async function getTokens() {
		await lottery.methods
			.getNumTokens()
			.call()
			.then((numTokens) => {
				setCarTokens(numTokens[0]);
				setPhoneTokens(numTokens[1]);
				setComputerTokens(numTokens[2]);
			});
	}

	// Bid handler
	const handleBid = async (id) => {
		// Call the bid function in the contract with id 0, and try to send 0.01 ether
		await lottery.methods
			.bid(id)
			.send({
				from: account,
				value: web3.utils.toWei("0.01", "ether"),
			})
			.then(() => {
				alert("Bid placed to item " + (id + 1));
			})
			.catch((err) => {
				alert("Transaction failed with error: " + err.message);
			});
		// Update the contract balance
		getContractBalance();
		// Update the tokens for each item
		await lottery.methods
			.getNumTokens()
			.call()
			.then((numTokens) => {
				setCarTokens(numTokens[0]);
				setPhoneTokens(numTokens[1]);
				setComputerTokens(numTokens[2]);
			});
	};

	// Reveal button handler
	const handleReveal = async () => {
		// Call the getNumTokens function in the contract
		await lottery.methods
			.getNumTokens()
			.call()
			.then((numTokens) => {
				// Get the number of tokens for each item
				setCarTokens(numTokens[0]);
				setPhoneTokens(numTokens[1]);
				setComputerTokens(numTokens[2]);
			});
		// Get the contract balance
		getContractBalance();
	};

	// Withdraw button handler
	const handleWithdraw = async () => {
		// Call the withdraw function in the contract
		await lottery.methods
			.withdrawFunds()
			.send({
				from: account,
			})
			.then(() => {
				alert("Successfully withdrew " + contractBalance + " ether");
				// Get the contract balance
				getContractBalance();
			})
			.catch((err) => {
				alert("Transaction failed with error: " + err.message);
			});
	};

	// Reveal Winners button handler
	const handleRevealWinners = async () => {
		// Call the revealWinners function in the contract
		await lottery.methods
			.revealWinners()
			.send({
				from: account,
			})
			.then(() => {
				alert("Winners revealed");
			})
			.catch((err) => {
				alert("Transaction failed with error: " + err.message);
			});
	};

	// Am I Winner button handler
	const handleAmIWinner = async () => {
		// Call getItemsWon function in the contract
		await lottery.methods
			.getItemsWon()
			.call({
				from: account,
			})
			.then((itemsWon) => {
				// if the items won are not empty, set the items won to the items won
				if (itemsWon.length > 0) {
					setItemsWon(itemsWon);
				}
				// if the items won are empty, set the items won to the empty array
				else {
					setItemsWon([]);
				}
			})
			.catch((err) => {
				alert("Transaction failed with error: " + err.message);
				setItemsWon();
			});
	};

	// Transfer Ownership button handler
	const handleTransferOwnership = async () => {
		// Call the transferOwnership function in the contract
		const newOwner = prompt("Enter the new owner's address");
		// Check if the address is valid
		if (web3.utils.isAddress(newOwner)) {
			await lottery.methods
				.transferOwnership(newOwner)
				.send({
					from: account,
				})
				.then(() => {
					alert("Ownership transferred to " + newOwner);
					// Update the owner
					setOwner(newOwner);
				})
				.catch((err) => {
					alert("Transaction failed with error: " + err.message);
				});
		}
	};

	// Start a new round button handler
	const handleStartNewRound = async () => {
		// Call the reset function in the contract
		await lottery.methods
			.reset()
			.send({
				from: account,
			})
			.then(() => {
				alert("New round started");
			})
			.catch((err) => {
				alert(
					"Transaction failed, possibly because winners have not been declared. Error message: " +
						err.message
				);
			});

		// Update the contract balance
		getContractBalance();
		// Update the tokens for each item
		await lottery.methods
			.getNumTokens()
			.call()
			.then((numTokens) => {
				setCarTokens(numTokens[0]);
				setPhoneTokens(numTokens[1]);
				setComputerTokens(numTokens[2]);
			});
	};

	// Destroy contract button handler
	const handleDestroyContract = async () => {
		// Show alert to confirm
		if (window.confirm("Are you sure you want to destroy the contract?")) {
			// Call the destroy function in the contract

			await lottery.methods
				.destroy()
				.send({
					from: account,
				})
				.then(() => {
					alert("Contract destroyed");
				})
				.catch((err) => {
					alert("Transaction failed with error: " + err.message);
				});
		}
	};

	return (
		<div className="App d-flex flex-column p-5 container-xl">
			<header className="border-bottom">
				<h1 className="">Lottery - Ballot</h1>
			</header>
			<div className="d-flex flex-column flex-md-row mt-5 gap-3 ">
				<div className="card col">
					<div className="card-header">
						<h3>Car</h3>
					</div>
					<div className="card-body d-flex flex-column">
						{/* item image */}
						<img src={car} alt="car" className="img-fluid" />
						<div className="d-flex justify-content-between mt-auto">
							<button
								className="btn btn-outline-secondary right-align"
								onClick={() => handleBid(0)}
							>
								Bid
							</button>
							<h3>{carTokens}</h3>
						</div>
					</div>
				</div>
				<div className="card col">
					<div className="card-header">
						<h3>Phone</h3>
					</div>
					<div className="card-body d-flex flex-column">
						{/* item image */}
						<img src={phone} alt="car" className="img-fluid" />
						<div className="d-flex justify-content-between mt-auto">
							<button
								className="btn btn-outline-secondary right-align"
								onClick={() => handleBid(1)}
							>
								Bid
							</button>
							<h3>{phoneTokens}</h3>
						</div>
					</div>
				</div>
				<div className="card col">
					<div className="card-header">
						<h3>Computer</h3>
					</div>
					<div className="card-body">
						{/* item image */}
						<img src={computer} alt="car" className="img-fluid" />
						<div className="d-flex justify-content-between">
							<button
								className="btn btn-outline-secondary right-align"
								onClick={() => handleBid(2)}
							>
								Bid
							</button>
							<h3>{computerTokens}</h3>
						</div>
					</div>
				</div>
			</div>

			<div className="d-flex flex-wrap justify-content-between mt-4 gap-5">
				<div className="d-flex flex-column flex-wrap gap-2">
					<span className="me-auto">Current Account:</span>
					<span className="mb-4 border border-1 border-dark rounded px-2">
						{account}
					</span>
					<div className="d-flex flex-column gap-2">
						<button
							className="w-50 btn btn-primary text-light me-auto"
							onClick={handleReveal}
						>
							Reveal
						</button>
						{account !== owner && account !== owner2 && (
							<div className="d-inline-flex">
								<button
									className="w-50 btn btn-primary text-light me-auto"
									onClick={handleAmIWinner}
								>
									Am I Winner
								</button>
							</div>
						)}
						{itemsWon && itemsWon.length > 0 ? (
							<span className="me-auto">
								You have won the following items:{" "}
								{itemsWon.toString()}
							</span>
						) : (
							itemsWon && (
								<span className="me-auto">
									You have not won any items.
								</span>
							)
						)}
					</div>
				</div>
				<div className="d-flex flex-column flex-wrap gap-2">
					<span className="me-auto">Owner's account:</span>
					<span className="mb-4 border border-1 border-dark rounded px-2">
						{owner}
					</span>
					{(account === owner || account === owner2) && (
						<div className="d-flex flex-column gap-2">
							<button
								className="w-50 btn btn-success text-light ms-auto"
								onClick={handleWithdraw}
							>
								Withdraw
							</button>

							<button
								className="w-50 btn btn-success text-light ms-auto"
								onClick={handleRevealWinners}
							>
								Declare Winners
							</button>
							<button
								className="w-50 btn btn-warning text-light ms-auto"
								onClick={handleTransferOwnership}
							>
								Transfer Ownership
							</button>
							<button
								className="w-50 btn btn-danger text-light ms-auto"
								onClick={handleStartNewRound}
							>
								Start new round
							</button>
							<button
								className="w-50 btn btn-danger text-light ms-auto"
								onClick={handleDestroyContract}
							>
								Destroy Contract
							</button>
						</div>
					)}
				</div>
			</div>
			<span>The contract's balance is: {contractBalance} Ether</span>
		</div>
	);
}

export default App;
