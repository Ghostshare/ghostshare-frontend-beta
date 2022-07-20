require("@nomiclabs/hardhat-waffle");
const { INFURA_URL, MUMBAI_PRIVATE_KEY } = require("./secrets.json");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: "./artifacts",
    tests: "./tests",
  },
  networks: {
    mumbai: {
      url: INFURA_URL || "",
      accounts: MUMBAI_PRIVATE_KEY !== undefined ? MUMBAI_PRIVATE_KEY : [],
    },
  },
};
