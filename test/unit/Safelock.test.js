const hre = require("hardhat")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Safelock", () => {
          let safelockFactory, deployer, user, safelock, safelockAddress
          const firstName = networkConfig[network.config.chainId]["firstName"]
          const amount = ethers.utils.parseEther(networkConfig[network.config.chainId]["amount"])
          const timeLength = networkConfig[network.config.chainId]["timeLength"]
          beforeEach(async () => {
              await deployments.fixture(["actual-deployment"])
              deployer = (await hre.getNamedAccounts()).deployer
              user = (await ethers.getSigners())[1]
              safelockFactory = await ethers.getContract("SafelockFactory", user)
              safelockAddress = await safelockFactory.getMySafelockAddress()
              safelock = await ethers.getContractAt("Safelock", safelockAddress, user)
          })
          describe("SafelockFactory", () => {
              it("doesn't allow multiple safelock creation by the same wallet", async () => {
                  await expect(safelockFactory.createSafelock(firstName)).to.be.revertedWith(
                      "SafelockFactory__AlreadyHasSafelock"
                  )
              })
              it("gets the safelock id of a transaction sending address", async () => {
                  const id = (await safelockFactory.getMySafelockId()).toString()
                  assert.equal(id, "1")
              })
              it("returns null address when a wallet with no safelock tries to get an address", async () => {
                  const nullAddress = "0x0"
                  const attackerSafelockFactory = await safelockFactory.connect(
                      (
                          await ethers.getSigners()
                      )[2]
                  )
                  const attackerSafelockAddress =
                      await attackerSafelockFactory.getMySafelockAddress()
                  assert.equal(parseInt(attackerSafelockAddress), parseInt(nullAddress))
              })
          })
          describe("createSafe", () => {
              it("only allows the owner to call", async () => {
                  const attacker = (await ethers.getSigners())[2]
                  const attackerSafelock = await safelock.connect(attacker)
                  await expect(
                      attackerSafelock.createSafe(timeLength, user.address, { value: amount })
                  ).to.be.revertedWith("Safe__onlyOwner")
              })
              it("reverts if value is zero", async () => {
                  await expect(safelock.createSafe(timeLength, user.address)).to.be.reverted
              })
              it("reverts if timeLength is zero", async () => {
                  await expect(safelock.createSafe("0", user.address, { value: amount })).to.be
                      .reverted
              })
              it("adds a new safe to the safe array", async () => {
                  await safelock.createSafe(timeLength, user.address, { value: amount })
                  const safes = await safelock.getSafes()
                  console.log({safes})
                  assert.equal(safes.length, 1)
              })
              it("increases the safe balance", async () => {
                  await safelock.createSafe(timeLength, user.address, { value: amount })
                  const newSafeBalance = (await safelock.getSafeBalance("0")).toString()
                  assert.equal(amount, newSafeBalance)
              })
              it("increases the total balance", async () => {
                  const oldTotalBalance = (await safelock.getTotalBalance()).toString()
                  console.log({ oldTotalBalance })
                  await safelock.createSafe(timeLength, user.address, { value: amount })
                  const newTotalBalance = (await safelock.getTotalBalance()).toString()
                  console.log({ newTotalBalance })
                  assert.equal(amount.toString(), newTotalBalance)
              })
              it("emits an event", async () => {
                  expect(
                      await safelock.createSafe(timeLength, user.address, { value: amount })
                  ).to.emit("SafeCreated")
              })
          })
          describe("withdraw", () => {
              beforeEach(async () => {
                  await safelock.createSafe(timeLength, user.address, { value: amount })
              })
              it("requires the index of the safe to exist", async () => {
                  await expect(safelock.withdraw("1")).to.be.revertedWith(
                      "Safe__WithdrawIndexOutOfRange"
                  )
              })
              it("reverts if time has not yet elapsed", async () => {
                  await expect(safelock.withdraw("0")).to.be.revertedWith("Safe__notYetOpen")
              })
              it("reverts if safe is already broken", async () => {
                  await network.provider.send("evm_increaseTime", [parseInt(timeLength) + 10])
                  await safelock.withdraw("0")
                  await expect(safelock.withdraw("0")).to.be.revertedWith("Safe__AlreadyWithdrawn")
              })
              it("updates total balance if time has passed", async () => {
                  await network.provider.send("evm_increaseTime", [parseInt(timeLength) + 10])
                  await safelock.withdraw("0")
                  const newTotalBalance = (await safelock.getTotalBalance()).toString()
                  assert.equal(newTotalBalance, "0")
              })

              it("sets the isBroken boolean to true for that safe", async () => {
                  await network.provider.send("evm_increaseTime", [parseInt(timeLength) + 10])
                  await safelock.withdraw("0")
                  const newSafeIsBrokenBool = (await safelock.getSafes())[0].isBroken
                  assert.equal(newSafeIsBrokenBool, true)
              })
              it("transfers ethereum from the contract to the withdrawer", async () => {
                  await network.provider.send("evm_increaseTime", [parseInt(timeLength) + 10])
                  const oldContractBalance = (
                      await safelock.provider.getBalance(safelock.address)
                  ).toString()
                  await safelock.withdraw("0")
                  const newContractBalance = (
                      await safelock.provider.getBalance(safelock.address)
                  ).toString()
                  assert.equal(oldContractBalance, amount)
                  assert.equal(newContractBalance, "0")
              })
              it("emits an event after withdrawal", async () => {
                  await network.provider.send("evm_increaseTime", [parseInt(timeLength) + 10])
                  expect(await safelock.withdraw("0")).to.emit("SafeWithdrawn")
              })
          })
          describe("view functions", () => {
              it("gets the safelock owner's first name", async () => {
                  const ownerFirstName = await safelock.getOwnerFirstName()
                  assert.equal(firstName, ownerFirstName)
              })
          })
      })
