const { network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

const { assert, expect } = require("chai")

(!developmentChains.includes(network.name))?describe.skip:describe("Safelock", ()=>{
    
})
