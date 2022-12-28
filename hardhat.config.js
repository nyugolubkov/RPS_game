
require("@nomiclabs/hardhat-web3")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")

require("dotenv").config();

const privateKey = process.env.GOERLI_PRIVATE_KEY;
const endpoint = process.env.URL;
const etherscanKey = process.env.ETHERSCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: endpoint,
      accounts: [privateKey]
    }
  },
  etherscan: {
    apiKey: etherscanKey
  }
};
