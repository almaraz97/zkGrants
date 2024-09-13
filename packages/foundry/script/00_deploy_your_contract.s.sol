//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/SemaphoreRelease.sol";
import "./DeployHelpers.s.sol";

contract DeploySemaphoreRelease is ScaffoldETHDeploy {
  function run() external {
    uint256 deployerPrivateKey = setupLocalhostEnv();
    vm.startBroadcast(deployerPrivateKey);

    SemaphoreRelease semaphoreRelease = new SemaphoreRelease();
    console.logString(
      string.concat(
        "YourContract deployed at: ", vm.toString(address(semaphoreRelease))
      )
    );

    vm.stopBroadcast();
  }
}
