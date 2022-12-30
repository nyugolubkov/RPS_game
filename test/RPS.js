const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RPS", function () {
    let rps;
    before(async () => {
        const RPS = await ethers.getContractFactory("RPS");
        rps = await RPS.deploy();
        await rps.deployed();
        accounts = await ethers.getSigners();
        choiceOne = 1; // rock (1 - rock, 2 - paper, 3 - scissors)
        saltOne = web3.utils.sha3("" + Math.random());
        encodedOne = web3.eth.abi.encodeParameters(['uint256', 'bytes32'], [choiceOne, saltOne]); // rock (1 - rock, 2 - paper, 3 - scissors)
        hashOne = web3.utils.sha3(encodedOne, { encoding: 'hex' });
        choiceTwo = 3; // scissors(1 - rock, 2 - paper, 3 - scissors)
        saltTwo = web3.utils.sha3("" + Math.random());
        encodedTwo = web3.eth.abi.encodeParameters(['uint256', 'bytes32'], [choiceTwo, saltOne]);
        hashTwo = web3.utils.sha3(encodedOne, { encoding: 'hex' });
    });

    it("should not have committed", async function () {
        await rps.bothCommitted().then(function(result) {
            expect(result).to.equal(false);
        });
    });

    it("should not have revealed", async function () {
        await rps.bothRevealed().then(function(result) {
            expect(result).to.equal(false);
        });
    });

    it("should revert zero value", async function () {
        expect(rps.regPlayer()).to.be.revertedWith("Bet is lower than possible minimum");
    });

    it("should not be registered", async function () {
        await rps.isRegistered(accounts[1].address).then(function(result) {
            expect(result).to.equal(false);
        });
        await rps.isRegistered(accounts[2].address).then(function(result) {
            expect(result).to.equal(false);
        });
    });

    it("should be registered", async function () {
        await rps.connect(accounts[1]).regPlayer({value: 1000000}).then(function(result) {
            rps.isRegistered(accounts[1].address).then(function(result) {
                expect(result).to.equal(true);
            });
        });
        await rps.connect(accounts[2]).regPlayer({value: 1000000}).then(function(result) {
            rps.isRegistered(accounts[2].address).then(function(result) {
                expect(result).to.equal(true);
            });
        });
    });

    it("should not commit", async function () {
        expect(rps.connect(accounts[1]).commitMove("", {value: 1000000})).to.be.revertedWith("Game hash was not provided");
    });

    it("should not be committed", async function () {
        rps.isCommitted(accounts[1].address).then(function(result) {
            expect(result).to.equal(false);
        });
    });

    it("should commit", async function () {
        rps.connect(accounts[1]).commitMove(hashOne).then(function(result) {
            rps.isCommitted(accounts[1].address).then(function(result) {
                expect(result).to.equal(true);
            });
        });
        rps.connect(accounts[2]).commitMove(hashOne).then(function(result) {
            rps.isCommitted(accounts[2].address).then(function(result) {
                expect(result).to.equal(true);
            });
        });
    });

    it("should not be revealed", async function () {
        rps.isRevealed(accounts[1].address).then(function(result) {
            expect(result).to.equal(false);
        });
    });

    it("should not reveal", async function () {
        expect(rps.connect(accounts[1]).revealChoice(0, saltOne)).to.be.revertedWith("Incorrect choice");
        expect(rps.connect(accounts[1]).revealChoice(4, saltOne)).to.be.revertedWith("Incorrect choice");
        expect(rps.connect(accounts[1]).revealChoice(2, saltOne)).to.be.revertedWith("problem with salt");
    });

    it("should reveal", async function () {
        rps.connect(accounts[1]).revealChoice(choiceOne, saltOne).then(function(result) {
            rps.isRevealed(accounts[1].address).then(function(result) {
                expect(result).to.equal(true);
            });
        });
        rps.connect(accounts[2]).revealChoice(choiceTwo, saltTwo).then(function(result) {
            rps.isRevealed(accounts[2].address).then(function(result) {
                expect(result).to.equal(true);
            });
        });
    });

    it("should end", async function () {
        rps.connect(accounts[1]).endGames().then(function(result) {
            rps.isRevealed(accounts[1].address).then(function(result) {
                expect(result.events.GetGameOutcome.returnValues[0]).to.equal(1);
            });
        });
    });
});