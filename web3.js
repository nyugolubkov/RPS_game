const Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider("https://eth-goerli.g.alchemy.com/v2/EKjjmJcgh_C9kN0RHFCGwSS1zA322EXw"));
const mainAccount = "0x91cDa83c363A6F72f81A2041836b1e79b4a01Ab1";
const otherAccount = "0xE2327Ed11E0F9a312EbDA5AF3bFbAF85C30163C1";
const address = "0x2D2297fb92b579D6504720feD2b62c298caB065D";
const ABI = [
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
		"inputs": [
			{
				"internalType": "address",
				"name": "playerOne",
				"type": "address"
			}
		],
		"name": "endGame",
		"outputs": [
			{
				"internalType": "enum RPS.GameOutcome",
				"name": "gameResult",
				"type": "uint8"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "games",
		"outputs": [
			{
				"internalType": "address",
				"name": "playerOne",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "playerTwo",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "stake",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "playerOneChoice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "playerTwoChoice",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "playerOneHash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "playerTwoHash",
				"type": "bytes32"
			},
			{
				"internalType": "enum RPS.GameStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "enum RPS.GameOutcome",
				"name": "outcome",
				"type": "uint8"
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
			},
			{
				"internalType": "address",
				"name": "opponent",
				"type": "address"
			}
		],
		"name": "participateGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerBalances",
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
			},
			{
				"internalType": "address",
				"name": "playerOne",
				"type": "address"
			}
		],
		"name": "revealChoice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "gameHash",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "opponent",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "gameStake",
				"type": "uint256"
			}
		],
		"name": "startGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
web3.eth.getBalance(mainAccount).then(console.log)
web3.eth.getBalance(otherAccount).then(console.log)
const myContract = new web3.eth.Contract(ABI, address)
const privateKey = "b2301c675fac36e9dfd994879b48a1ec4cdf6481f4230f9b43eec0b1f41a867d"
const options = ['rock', 'paper', 'scissors']
let choice = 'rock'
let gameChoice = options.indexOf(choice) + 1;
let saltOne =  web3.utils.sha3("" + Math.random());
let encoded = web3.eth.abi.encodeParameters(['uint256', 'bytes32'],[gameChoice, saltOne]);
let hashOne = web3.utils.sha3(encoded, {encoding: 'hex'});
console.log('Player one salt: ', saltOne);
console.log('Player one hash: ', hashOne);
if (hashOne !== undefined && hashOne !== null) {
    var bet = web3.utils.toWei(web3.utils.toBN('1'), 'kwei');
    
    const startGameTX = {
        from: mainAccount,
        to: address,
        gas: 50000,
        data: myContract.methods.startGame(hashOne, otherAccount, bet).encodeABI()
    }
    const startGameSignature = web3.eth.accounts.signTransaction(startGameTX, privateKey)
    web3.eth.sendSignedTransaction(startGameSignature.rawTransaction).catch(err => console.log(err));
    //web3.eth.sendSignedTransaction(startGameSignature.rawTransaction).on(
    //    'receipt', function(receipt){
    //    console.log('receipt from startGame _> status: ' + receipt.status + ', gas: ' + receipt.gasUsed);
    //}).catch(err => console.log(err)); 
}