//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract Safelock {
    //Type declarations
    struct Safe {
        uint256 amount;
        uint256 createdTime;
        uint256 timeLength;
        bool broken;
    }

    //state variables
    Safe[] s_safes;
    uint256 immutable i_safeId;
    uint256 s_totalBalance;
    address immutable i_safeLockOwner;

    //Custom Errors
    error Safe__onlyOwner();

    //Events
    event SafeCreated(address indexed creator, uint256 indexed amount, uint256 timeLength);

    //Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_safeLockOwner) {
            revert Safe__onlyOwner();
        }
        _;
    }

    //Constructor
    constructor(uint256 safeId, address safeLockOwner) {
        i_safeId = safeId;
        i_safeLockOwner = safeLockOwner;
    }

    function createSafe(uint256 _amount, uint256 _timeLength) public payable onlyOwner {
        require(msg.value > 0);
        require(_timeLength > 0);
        Safe memory newSafe = Safe(_amount, block.timestamp, _timeLength, false);
        s_safes.push(newSafe);
        s_totalBalance += msg.value;
        emit SafeCreated(msg.sender, msg.value, _timeLength);
    }
}
