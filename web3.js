const Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider("https://eth-goerli.g.alchemy.com/v2/EKjjmJcgh_C9kN0RHFCGwSS1zA322EXw"));
const mainAccount = "0x91cDa83c363A6F72f81A2041836b1e79b4a01Ab1";
const otherAccount = "0xE2327Ed11E0F9a312EbDA5AF3bFbAF85C30163C1";
const address = "0xB5b06b5dc98A57b451BfCE731c247acB4A4b93e2";
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
const privateKey = "b2301c675fac36e9dfd994879b48a1ec4cdf6481f4230f9b43eec0b1f41a867d"
const options = ['rock', 'paper', 'scissors']
let choice = 'rock'
let gameChoice = options.indexOf(choice) + 1;
let saltOne = web3.utils.sha3("" + Math.random());
let encoded = web3.eth.abi.encodeParameters(['uint256', 'bytes32'], [gameChoice, saltOne]);
let hashOne = web3.utils.sha3(encoded, { encoding: 'hex' });
console.log('Player one salt: ', saltOne);
console.log('Player one hash: ', hashOne);

const regGame = async() => {
    if (hashOne !== undefined && hashOne !== null) {
        const playerOneRegTX = {
            from: mainAccount,
            to: address,
            gas: 50000,
            value: "10000",
            data: myContract.methods.regPlayer().encodeABI()
        }
        const playerOneRegSignature = await web3.eth.accounts.signTransaction(playerOneRegTX, privateKey);
        web3.eth.sendSignedTransaction(playerOneRegSignature.rawTransaction).catch(err => console.log(err));
    }
}
regGame();