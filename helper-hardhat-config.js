const { ethers } = require("hardhat")

const networkConfig = {
    4: {
        name: "rinkeby",
        firstName: "Firstname",
        amount: "100",
        timeLength: "300",
    },
    80001: {
        name: "mumbai",
        firstName: "Firstname",
        amount: "0.1",
        timeLength: "300",
    },
    31337: {
        name: "hardhat",
        firstName: "Firstname",
        amount: "0.1",
        timeLength: "300",
    },
    5: {
        name: "goerli",
        firstName: "Firstname",
        amount: "0.1",
        timeLength: "300",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = { networkConfig, developmentChains }
