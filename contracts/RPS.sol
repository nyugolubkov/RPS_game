// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

contract RPS {
    uint constant MIN_BET = 1000;

    event GetGameOutcome(GameOutcome);

    enum GameOutcome {
        draw,
        playerOne,
        playerTwo
    }

    enum GameChoice {
        none,
        rock,
        paper,
        scissors
    }

    address payable playerOne;
    address payable playerTwo;

    uint public stake;
    GameOutcome public outcome;

    GameChoice private playerOneChoice;
    GameChoice private playerTwoChoice;

    bytes32 private playerOneHash;
    bytes32 private playerTwoHash;

    modifier validBet() {
        require(msg.value >= MIN_BET, "Bet is lower than possible minimum");
        require(stake == 0 || msg.value >= stake, "Problem with the stake");
        _;
    }

    modifier notRegistered() {
        require(msg.sender != playerOne && msg.sender != playerTwo, "This player has already registered");
        _;
    }

    modifier hasRegistered() {
        require (msg.sender == playerOne || msg.sender == playerTwo, "Not registered player yet");
        _;
    }

    modifier hashProvided(bytes32 gameHash) {
        require(gameHash != "", "Game hash was not provided");
        _;
    }

    modifier correctChoice(uint choice) {
        require (choice >= 1 && choice <= 3, "Incorrect choice");
        _;
    }

    modifier committed() {
        require(playerOneHash != 0x0 && playerTwoHash != 0x0);
        _;
    }

    modifier revealed() {
        require(playerOneChoice != GameChoice.none && playerTwoChoice != GameChoice.none);
        _;
    }

    function regPlayer() public payable validBet notRegistered returns (uint) {
        if (playerOne == address(0x0)) {
            playerOne = payable(msg.sender);
            stake = msg.value;
            return 1;
        } else if (playerTwo == address(0x0)) {
            playerTwo = payable(msg.sender);
            return 2;
        }
        return 0;
    }

    function commitMove(bytes32 gameHash) public hasRegistered hashProvided(gameHash) returns (bool) {
        if (msg.sender == playerOne && playerOneHash == 0x0) {
            playerOneHash = gameHash;
        } else if (msg.sender == playerTwo && playerTwoHash == 0x0) {
            playerTwoHash = gameHash;
        } else {
            return false;
        }
        return true;
    }

    function revealChoice(uint choice, bytes32 salt) public hasRegistered correctChoice(choice) committed returns (GameChoice) {
        if(playerOne == msg.sender) {
            require(playerOneHash == getSaltedHash(choice, salt), "problem with salt");
            playerOneChoice = GameChoice(choice);
            return playerOneChoice;
        } else if(playerTwo == msg.sender) {
            require(playerTwoHash == getSaltedHash(choice, salt), "problem with salt");
            playerTwoChoice = GameChoice(choice);
            return playerTwoChoice;
        } else {
            revert("Problem with addresses");
        }
    }

    function endGames() external revealed returns(GameOutcome) {
        outcome = GameOutcome((3 + uint(playerOneChoice) - uint(playerTwoChoice)) % 3);

        if (outcome == GameOutcome.playerOne) {
            playerOne.transfer(address(this).balance);
        } else if (outcome == GameOutcome.playerTwo) {
            playerTwo.transfer(address(this).balance);
        } else {
            playerOne.transfer(stake);
            playerTwo.transfer(address(this).balance);
        }
        
        emit GetGameOutcome(outcome);
        return outcome;
    }

    function reset() private {
        stake = 0;
        playerOne = payable(address(0x0));
        playerTwo = payable(address(0x0));
        playerOneHash = 0x0;
        playerTwoHash = 0x0;
        playerOneChoice = GameChoice.none;
        playerTwoChoice = GameChoice.none;
    }
    
    function getSaltedHash(uint answer, bytes32 salt) internal pure returns (bytes32) {
       return keccak256(abi.encodePacked(answer, salt));
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function bothCommitted() public view returns (bool) {
        return (playerOneHash != 0x0 && playerTwoHash != 0x0);
    }

    function bothRevealed() public view returns (bool) {
        return (playerOneChoice != GameChoice.none && playerTwoChoice != GameChoice.none);
    }
}