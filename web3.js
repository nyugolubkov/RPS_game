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

let playerOneChoice = 'rock'
let playerOneGameChoice = options.indexOf(playerOneChoice) + 1;
let saltOne = web3.utils.sha3("" + Math.random());
let encodedOne = web3.eth.abi.encodeParameters(['uint256', 'bytes32'], [playerOneGameChoice, saltOne]);
let hashOne = web3.utils.sha3(encodedOne, { encoding: 'hex' });
console.log('Player one choice: ', playerOneChoice);
console.log('Player one salt: ', saltOne);
console.log('Player one hash: ', hashOne);

let playerTwoChoice = 'scissors'
let playerTwoGameChoice = options.indexOf(playerTwoChoice) + 1;
let saltTwo = web3.utils.sha3("" + Math.random());
let encodedTwo = web3.eth.abi.encodeParameters(['uint256', 'bytes32'], [playerTwoGameChoice, saltTwo]);
let hashTwo = web3.utils.sha3(encodedTwo, { encoding: 'hex' });
console.log('Player two choice: ', playerTwoChoice);
console.log('Player two salt: ', saltTwo);
console.log('Player two hash: ', hashTwo);

async function regGame(account) {
    let regTX = {
        from: account,
        to: address,
        gas: 100000,
        value: 10000,
        data: myContract.methods.regPlayer().encodeABI()
    }
    let regSignature = await web3.eth.accounts.signTransaction(regTX, privateKey);
    web3.eth.sendSignedTransaction(regSignature.rawTransaction).catch(err => console.log(err));
    console.log('Player has registered');
}

async function commitMove(hash, account) {
    if (hash !== undefined && hash !== null) {
        let commitTX = {
            from: account,
            to: address,
            gas: 100000,
            value: 10000,
            data: myContract.methods.commitMove(hash).encodeABI()
        }
        let commitSignature = await web3.eth.accounts.signTransaction(commitTX, privateKey);
        web3.eth.sendSignedTransaction(commitSignature.rawTransaction).catch(err => console.log(err));
        console.log('Player committed');
    }
}

async function revealChoice(choice, salt, account) {
    let revealTX = {
        from: account,
        to: address,
        gas: 100000,
        value: 10000,
        data: myContract.methods.revealChoice(choice, salt).encodeABI()
    }
    let revealSignature = await web3.eth.accounts.signTransaction(revealTX, privateKey);
    web3.eth.sendSignedTransaction(revealSignature.rawTransaction).catch(err => console.log(err));
    console.log('Player has revealed');
}

async function endGame(account) {
    let endTX = {
        from: account,
        to: address,
        gas: 100000,
        value: 10000,
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
    }).catch(err => console.log(err));
    console.log('Player has ended');
}

let regPromises = [];
regPromises.push(regGame(mainAccount));
regPromises.push(regGame(otherAccount));
Promise.all(regPromises).then(function() {
    let commitPromises = [];
    commitPromises.push(commitMove(hashOne, mainAccount));
    commitPromises.push(commitMove(hashTwo, otherAccount));
    
    Promise.all(commitPromises).then(function() {
        let revealPromises = [];
        revealPromises.push(revealChoice(playerOneGameChoice, saltOne, mainAccount));
        revealPromises.push(revealChoice(playerTwoGameChoice, saltTwo, otherAccount));
    
        Promise.all(revealPromises).then(function() {
            endGame(mainAccount);
        })
    })
})