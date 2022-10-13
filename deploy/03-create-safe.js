const { ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { getSigners } = ethers

module.exports = async ({ deployments, getNamedAccounts }) => {
    const user = (await getSigners())[1]
    const { log } = deployments
    const safelockFactory = await ethers.getContract("SafelockFactory", user)
    const mySafelockAddress = await safelockFactory.getMySafelockAddress()
    const safelock = await ethers.getContractAt("Safelock", mySafelockAddress, user)
    log("-------creating 2 safelocks-------")
    await safelock.createSafe("300", { value: ethers.utils.parseEther("1") })
    await safelock.createSafe("172800", { value: ethers.utils.parseEther("2") })
}

module.exports.tags = ["all", "create-safe"]
