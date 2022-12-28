// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

contract RPS {
    event GetGameOutcome(GameOutcome);

    enum GameStatus {
        nonExistent,
        started,
        participated,
        ended
    }

    enum GameOutcome {
        draw,
        playerOne,
        playerTwo
    }

    struct Game {
        address playerOne;
        address playerTwo;
        uint stake;
        uint  playerOneChoice;
        uint  playerTwoChoice;
        bytes32 playerOneHash;
        bytes32 playerTwoHash;
        GameStatus  status;
        GameOutcome outcome;
    }

    mapping (address => Game) public games;
    mapping (address => uint) public playerBalances;

    modifier HashOpponent(bytes32 gameHash, address opponent, uint gameStake) {
        require(gameHash != "", "game hash was not provided");
        require(opponent != address(0x0) && opponent != msg.sender, "Problem with other player...");
        require(gameStake <= playerBalances[msg.sender], "Players funds are insufficient");
        _;
    }

    function startGame(bytes32 gameHash, address opponent, uint gameStake) external HashOpponent(gameHash, opponent, gameStake) {
        require(games[msg.sender].status == GameStatus.nonExistent, "Problem with game status...");

        playerBalances[msg.sender] = playerBalances[msg.sender] - gameStake;
        
        games[msg.sender].playerOneHash = gameHash;
        games[msg.sender].playerOne = msg.sender;
        games[msg.sender].playerTwo = opponent;
        games[msg.sender].stake = gameStake;
        games[msg.sender].status = GameStatus.started;
    }

    function participateGame(bytes32 gameHash, address opponent) external HashOpponent(gameHash, opponent, games[opponent].stake) {
        require(games[opponent].playerTwo == msg.sender, "You are not Player 2 for this game");
        require(games[opponent].status == GameStatus.started, "Game not started or has already been participated in");

        uint gameStake = games[opponent].stake;
        playerBalances[msg.sender] = playerBalances[msg.sender] - gameStake;

        games[opponent].playerTwoHash = gameHash;
        games[opponent].status = GameStatus.participated;
    }

    function revealChoice(uint choice, bytes32 salt, address playerOne) external {        
        require(games[playerOne].status == GameStatus.participated, "Game does not exist or player Two has not placed a bet yet");                
       
        if(games[playerOne].playerOne == msg.sender) {
            require(games[playerOne].playerOneHash == getSaltedHash(choice, salt), "problem with salt");
            games[playerOne].playerOneChoice = choice;
        } else if(games[playerOne].playerTwo == msg.sender) {
            require(games[playerOne].playerTwoHash == getSaltedHash(choice, salt), "problem with salt");
            games[playerOne].playerTwoChoice = choice;
        } else {
            revert("Problem with addresses");
        }
    }
    
    function endGame(address playerOne) external returns(GameOutcome gameResult) {
        require(
          games[playerOne].playerOneChoice > 0 &&
          games[playerOne].playerTwoChoice > 0 ,
          "Both players need to reveal their choice before game can be completed"
        );

        address playerTwo = games[playerOne].playerTwo;
        uint playerOneChoice = games[playerOne].playerOneChoice;
        uint playerTwoChoice = games[playerOne].playerTwoChoice;
        uint stake = games[playerOne].stake;

        gameResult = GameOutcome((3 + playerOneChoice - playerTwoChoice) % 3);

        if(gameResult == GameOutcome.draw){
            playerBalances[playerOne] = playerBalances[playerOne] + stake;
            playerBalances[playerTwo] = playerBalances[playerTwo] + stake;
        }
        else if(gameResult == GameOutcome.playerOne){
            playerBalances[playerOne] = playerBalances[playerOne] + stake * 2;
        }
        else if(gameResult == GameOutcome.playerTwo){
            playerBalances[playerTwo] = playerBalances[playerTwo] + stake * 2;
        }
        else{
            revert("Invalid Game Outcome");
        }

        emit GetGameOutcome(gameResult);
        return gameResult;
    }
    
    function getSaltedHash(uint answer, bytes32 salt) internal pure returns (bytes32) {
       return keccak256(abi.encodePacked(answer, salt));
    }
}