//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "./Safelock.sol";

contract SafelockFactory {
    //State Variables
    mapping(address => uint256) s_hasSafelock;
    uint256 s_latestSafelockId;
    Safelock[] s_safelocks; 

    constructor() {
        s_latestSafelockId = 0;
    }
}
