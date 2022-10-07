//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "./Safelock.sol";

contract SafelockFactory {
    //State Variables
    mapping(address => uint256) s_hasSafelock;
    uint256 s_latestSafelockId;
    Safelock[] s_safelocks;

    //Custom Errors
    error SafelockFactory__AlreadyHasSafelock();

    constructor() {
        s_latestSafelockId = 0;
    }

    //Pure Functions
    function createSafelock() public {
        if (s_hasSafelock[msg.sender] != 0) {
            revert SafelockFactory__AlreadyHasSafelock();
        }
        s_latestSafelockId += 1;
        Safelock newSafelock = new Safelock(s_latestSafelockId, msg.sender, address(this));
        s_hasSafelock[msg.sender] = s_latestSafelockId;
        s_safelocks.push(newSafelock);
    }

    //View Functions
    function getMySafelockAddress() public view returns (address) {
        uint256 id = s_hasSafelock[msg.sender];
        if (id == 0) {
            return address(0);
        } else {
            return address(s_safelocks[id - 1]);
        }
    }

    function getMySafelockId() public view returns (uint256) {
        uint256 id = s_hasSafelock[msg.sender];
        return id;
    }
}
