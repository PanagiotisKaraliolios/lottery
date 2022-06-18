import web3 from "./web3";

const address = "0x2F78908dF7d67decfD0835Ff10849D469A2bbcD6";
const abi = [
	{
		inputs: [],
		payable: true,
		stateMutability: "payable",
		type: "constructor",
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "uint256",
				name: "_itemId",
				type: "uint256",
			},
		],
		name: "bid",
		outputs: [],
		payable: true,
		stateMutability: "payable",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "bidAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "bidders",
		outputs: [
			{
				internalType: "uint256",
				name: "personId",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "addr",
				type: "address",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [],
		name: "destroy",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "getItemsWon",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "getNumTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "items",
		outputs: [
			{
				internalType: "uint256",
				name: "itemId",
				type: "uint256",
			},
			{
				internalType: "string",
				name: "name",
				type: "string",
			},
			{
				internalType: "bool",
				name: "hasWinner",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address payable",
				name: "",
				type: "address",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "owner2",
		outputs: [
			{
				internalType: "address payable",
				name: "",
				type: "address",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [],
		name: "reset",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [],
		name: "revealWinners",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address payable",
				name: "_newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "winners",
		outputs: [
			{
				internalType: "address",
				name: "addr",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "itemId",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "winnersDrawn",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [],
		name: "withdrawFunds",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
];

const lottery = new web3.eth.Contract(abi, address);

export default lottery;
