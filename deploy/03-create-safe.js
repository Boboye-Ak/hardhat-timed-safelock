const { ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { getSigners } = ethers

module.exports = async ({ deployments, getNamedAccounts }) => {
    const user = (await getSigners())[1]
    const user2 = (await getSigners())[2]
    const { log } = deployments
    const safelockFactory = await ethers.getContract("SafelockFactory", user)
    const mySafelockAddress = await safelockFactory.getMySafelockAddress()
    const safelock = await ethers.getContractAt("Safelock", mySafelockAddress, user)
    log("-------creating 3 safelocks-------")
    await safelock.createSafe("300", user.address, { value: ethers.utils.parseEther("0.01") })
    await safelock.createSafe("172800", user.address, { value: ethers.utils.parseEther("0.02") })
    await safelock.createSafe("3600", user2.address, { value: ethers.utils.parseEther("0.03") })
}

module.exports.tags = ["all", "create-safe"]
