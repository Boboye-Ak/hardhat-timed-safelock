const { ethers } = require("hardhat")

const networkConfig = {
    4: {
        name: "rinkeby",
        firstName: "Firstname",
    },
    80001: {
        name: "mumbai",
        firstName: "Firstname",
    },
    31337: {
        name: "hardhat",
        firstName: "Firstname",
    },
    5: {
        name: "goerli",
        firstName: "Firstname",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = { networkConfig, developmentChains }
