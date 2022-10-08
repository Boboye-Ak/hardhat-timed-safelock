const { ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { getSigners } = ethers

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const user = (await getSigners())[1]
    const safelockFactory = await ethers.getContract("SafelockFactory", user)
    log(`----------sending deployment transaction for safelock from ${user.address}-----------`)
    const firstName = networkConfig[network.config.chainId]["firstName"]
    const tx = await safelockFactory.createSafelock(firstName)
    const txReceipt = await tx.wait(1)
    const safelockAddress = await safelockFactory.getMySafelockAddress()
    log(`----------safelock deployed with address ${safelockAddress}----------`)
}

module.exports.tags = ["all", "Safelock"]
