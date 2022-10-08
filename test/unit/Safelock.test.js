const { network, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const hre = require("hardhat")

const { assert, expect } = require("chai")(!developmentChains.includes(network.name))
    ? describe.skip
    : describe("Safelock", () => {
          let safelockFactory, deployer, user, safelock, safelockAddress
          const firstName = networkConfig[network.config.chainId]["firstName"]
          const amount = ethers.utils.parseEther(networkConfig[network.config.chainId]["amount"])
          const timeLength = networkConfig[network.config.chainId]["timeLength"]
          beforeEach(async () => {
              await deployments.fixture(["all"])
              deployer = (await hre.getNamedAccounts()).deployer
              user = (await ethers.getSigners())[1]
              safelockFactory = await ethers.getContract("SafelockFactory", user)
              safelockAddress = await safelockFactory.getMySafelockAddress()
              safelock = await ethers.getContractAt("Safelock", safelockAddress, user)
          })
          describe("createSafe", () => {
              it("reverts if value is zero", async () => {
                  await safelock.createSafe(amount, timeLength)
              })
          })
      })
