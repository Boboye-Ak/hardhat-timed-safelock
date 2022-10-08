//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract Safelock {
    //Type declarations
    struct Safe {
        uint256 amount;
        uint256 createdTime;
        uint256 timeLength;
        bool isBroken;
    }

    //state variables
    Safe[] s_safes;
    uint256 immutable i_safeId;
    uint256 s_totalBalance;
    address immutable i_safeLockOwner;
    address immutable i_safeLockFactoryAddress;
    string s_ownerFirstName;

    //Custom Errors
    error Safe__onlyOwner();
    error Safe__notYetOpen(uint256 timeLeft);
    error Safe__WithdrawIndexOutOfRange();
    error Safe__AlreadyWithdrawn();

    //Events
    event SafeCreated(address indexed creator, uint256 indexed amount, uint256 timeLength);
    event SafeWithdrawn(address indexed withdrawer, uint256 indexed index, uint256 indexed amount);

    //Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_safeLockOwner) {
            revert Safe__onlyOwner();
        }
        _;
    }

    //Constructor
    constructor(
        uint256 safeId,
        address safeLockOwner,
        address safeLockFactoryAddress,
        string memory ownerFirstName
    ) {
        i_safeId = safeId;
        i_safeLockOwner = safeLockOwner;
        i_safeLockFactoryAddress = safeLockFactoryAddress;
        s_ownerFirstName = ownerFirstName;
    }

    function createSafe(uint256 _timeLength) public payable onlyOwner {
        require(msg.value > 0);
        require(_timeLength > 0);
        Safe memory newSafe = Safe(msg.value, block.timestamp, _timeLength, false);
        s_safes.push(newSafe);
        s_totalBalance += msg.value;
        emit SafeCreated(msg.sender, msg.value, _timeLength);
    }

    function withdraw(uint256 index) public payable onlyOwner {
        if (index >= s_safes.length) {
            revert Safe__WithdrawIndexOutOfRange();
        }
        if (block.timestamp - s_safes[index].createdTime < s_safes[index].timeLength) {
            revert Safe__notYetOpen(
                s_safes[index].createdTime + s_safes[index].timeLength - block.timestamp
            );
        }
        if (s_safes[index].isBroken) {
            revert Safe__AlreadyWithdrawn();
        }
        uint256 amount = s_safes[index].amount;
        s_totalBalance -= s_safes[index].amount;
        s_safes[index].amount = 0;
        s_safes[index].isBroken = true;
        payable(msg.sender).transfer(amount);
        emit SafeWithdrawn(msg.sender, index, amount);
    }

    //View Functions
    function getSafes() public view returns (Safe[] memory) {
        return s_safes;
    }

    function getTotalBalance() public view returns (uint256) {
        return s_totalBalance;
    }

    function getSafeBalance(uint256 index) public view returns (uint256) {
        uint256 balance = s_safes[index].amount;
        return balance;
    }

    function getOwnerFirstName() public view returns (string memory) {
        return s_ownerFirstName;
    }
}
