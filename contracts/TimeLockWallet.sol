pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLockWallet is TimelockController {
    address public vaultStakingAddress;
    uint256 minDelay;
    address[] proposers;
    address[] executors;

    constructor(uint256 minDelay, address[] proposers, address[] executors) {}

}