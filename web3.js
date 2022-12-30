const Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider("https://eth-goerli.g.alchemy.com/v2/EKjjmJcgh_C9kN0RHFCGwSS1zA322EXw"));
const mainAccount = "0x91cDa83c363A6F72f81A2041836b1e79b4a01Ab1";
const otherAccount = "0xE2327Ed11E0F9a312EbDA5AF3bFbAF85C30163C1";
const address = "0x3575b2006b0448B9E3cc147CCe097f8F90EA25E8";
const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"name": "GameCommit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "GameRegister",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "enum RPS.GameChoice",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "GameReveal",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "enum RPS.GameOutcome",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "GetGameOutcome",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "bothCommitted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "bothRevealed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "gameHash",
				"type": "bytes32"
			}
		],
		"name": "commitMove",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endGames",
		"outputs": [
			{
				"internalType": "enum RPS.GameOutcome",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "increaseStake",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "isCommitted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "isRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "isRevealed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "outcome",
		"outputs": [
			{
				"internalType": "enum RPS.GameOutcome",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "regPlayer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "resetExternal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "choice",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "salt",
				"type": "bytes32"
			}
		],
		"name": "revealChoice",
		"outputs": [
			{
				"internalType": "enum RPS.GameChoice",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stake",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
web3.eth.getBalance(mainAccount).then(console.log)
web3.eth.getBalance(otherAccount).then(console.log)
const myContract = new web3.eth.Contract(ABI, address)
const privateKeyOne = "b2301c675fac36e9dfd994879b48a1ec4cdf6481f4230f9b43eec0b1f41a867d"
const privateKeyTwo = "e16a369682b54331b7e601d80164bde95ca31981e1251ac6a23c11ae29b848fb"
const options = ['rock', 'paper', 'scissors']

let playerOneChoice = 'rock'
let playerOneGameChoice = options.indexOf(playerOneChoice) + 1;
let saltOne = "0xa5105ca2a32aad66b707e8fa81dd340d22b9295719f2ab21679f0947318351d8";
let hashOne = "0x1962ceacf6b2a343aabc8e938ca4181166cc177bf18b739b61e13e4d174e0152";
//let saltOne = web3.utils.sha3("" + Math.random());
//let encodedOne = web3.eth.abi.encodeParameters(['uint256', 'bytes32'], [playerOneGameChoice, saltOne]);
//let hashOne = web3.utils.sha3(encodedOne, { encoding: 'hex' });
console.log('Player one choice: ', playerOneChoice);
console.log('Player one salt: ', saltOne);
console.log('Player one hash: ', hashOne);

let playerTwoChoice = 'scissors'
let playerTwoGameChoice = options.indexOf(playerTwoChoice) + 1;
let saltTwo = "0xad414e5464765b74b98d93c4ac327e2cdb4f4620d81187ce5d1265acbe2cc599";
let hashTwo = "0x0ffd377eef465058d19832e6f001e2cebac45ad19cd68336b6e6d98c387a72a5";
//let saltTwo = web3.utils.sha3("" + Math.random());
//let encodedTwo = web3.eth.abi.encodeParameters(['uint256', 'bytes32'], [playerTwoGameChoice, saltTwo]);
//let hashTwo = web3.utils.sha3(encodedTwo, { encoding: 'hex' });
console.log('Player two choice: ', playerTwoChoice);
console.log('Player two salt: ', saltTwo);
console.log('Player two hash: ', hashTwo);

async function regGame(currentAccount, privateKey) {
    let regTX = {
        from: currentAccount,
        to: address,
        gas: 100000,
        value: 10000,
        data: myContract.methods.regPlayer().encodeABI()
    }
    let regSignature = await web3.eth.accounts.signTransaction(regTX, privateKey);
    web3.eth.sendSignedTransaction(regSignature.rawTransaction)
            .catch(err => console.log(err))
            .then(function() {
                console.log('Player has registered')
            });
}

async function commitMove(hash, currentAccount, privateKey) {
    if (hash !== undefined && hash !== null) {
        let commitTX = {
            from: currentAccount,
            to: address,
            gas: 100000,
            data: myContract.methods.commitMove(hash).encodeABI()
        }
        let commitSignature = await web3.eth.accounts.signTransaction(commitTX, privateKey);
        web3.eth.sendSignedTransaction(commitSignature.rawTransaction)
        .catch(err => console.log(err))
        .then(function() {
            console.log('Player has committed')
        });
    }
}

async function revealChoice(choice, salt, currentAccount, privateKey) {
    let revealTX = {
        from: currentAccount,
        to: address,
        gas: 100000,
        data: myContract.methods.revealChoice(web3.utils.toBN(choice), salt).encodeABI()
    }
    let revealSignature = await web3.eth.accounts.signTransaction(revealTX, privateKey);
    web3.eth.sendSignedTransaction(revealSignature.rawTransaction)
    .catch(err => console.log(err))
    .then(function() {
        console.log('Player has revealed')
    });
}

async function endGame(currentAccount, privateKey) {
    let endTX = {
        from: currentAccount,
        to: address,
        gas: 100000,
        data: myContract.methods.endGames().encodeABI()
    }
    let endSignature = await web3.eth.accounts.signTransaction(endTX, privateKey);
    web3.eth.sendSignedTransaction(endSignature.rawTransaction).on('receipt', function(receipt){
        outCome = receipt.events.GetGameOutcome.returnValues[0];
        if(outCome == 0) {
            console.log('It is a draw');
        } else if(outCome == 1) {
            console.log('Player One Wins');
        } else if(outCome == 2) {
            console.log('Player Two Wins');
        } else {
            console.log('Problem with game');
        }
    })
    .catch(err => console.log(err))
    .then(function() {
        console.log('Game has ended')
    });
}

// Next commands need to run one by one, so 
// I just uncomment first, run. The comment it again. 
// After that I do the same with second and etc.
// (I do not know why, but revealChoice does not work, it crashes because salted choice in smart contract does not match with hash)
//regGame(mainAccount, privateKeyOne);
//regGame(otherAccount, privateKeyTwo);

//commitMove(hashOne, mainAccount, privateKeyOne);
//commitMove(hashTwo, otherAccount, privateKeyTwo);
    
//revealChoice(playerOneGameChoice, saltOne, mainAccount, privateKeyOne);
//revealChoice(playerTwoGameChoice, saltTwo, otherAccount, privateKeyTwo);
    
//endGame(mainAccount, privateKeyOne);