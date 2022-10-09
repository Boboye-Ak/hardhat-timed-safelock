const hre = require("hardhat")
const { ethers, network } = require("hardhat")
const fs = require("fs")

const SAFELOCKFACTORYABIFILE = "../next-js-timed-safelock/constants/SafelockFactoryABI.json"
const SAFELOCKABIFILE = "../next-js-timed-safelock/constants/SafelockABI.json"
const SAFELOCKFACTORYADDRESSFILE = "../next-js-timed-safelock/constants/SafelockFactoryAddress.json"
const chainId = network.config.chainId
module.exports = async () => {
    console.log("Updating frontend constants...")
    await updateAddresses()
    await updateABI()
}
const updateAddresses = async () => {
    const safelockFactory = await ethers.getContract("SafelockFactory")
    const currentAddresses = JSON.parse(fs.readFileSync(SAFELOCKFACTORYADDRESSFILE, "utf-8"))
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(safelockFactory.address)) {
            currentAddresses[chainId].push(safelockFactory.address)
        }
    }
    currentAddresses[chainId] = [safelockFactory.address]
    fs.writeFileSync(SAFELOCKFACTORYADDRESSFILE, JSON.stringify(currentAddresses))
}
const updateABI = async () => {
    let safelockABI = (await hre.artifacts.readArtifact("Safelock")).abi
    let safelockFactoryABI = (await hre.artifacts.readArtifact("SafelockFactory")).abi
    safelockABI = { abi: safelockABI }
    safelockFactoryABI = { abi: safelockFactoryABI }
    fs.writeFileSync(SAFELOCKABIFILE, JSON.stringify(safelockABI))
    fs.writeFileSync(SAFELOCKFACTORYABIFILE, JSON.stringify(safelockFactoryABI))
}
