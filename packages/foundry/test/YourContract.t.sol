// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/SemaphoreRelease.sol";
// import "../lib/semaphore/packages/contracts/contracts/Semaphore.sol";
import "../lib/v1-periphery/lib/denota-protocol/test/BaseRegistrarTest.t.sol";

// I changed all dependancies to ^0.8.0, I changed OZ to denota-protocol's v4.7.
// I copy and pasted semaphore contract dependancies by hand
// TODO why is denota packages the older versions???
contract SemaphoreReleaseTest is BaseRegistrarTest {
  // Semaphore public semaphore;

  function setUp() public override {
    super.setUp(); // deploys registrar, erc20s

    // semaphore = new Semaphore();
    HOOK = MockHook(address(new SemaphoreRelease())); // TODO will this work?
  }

  function _setupThenWrite(
    address caller,
    uint256 escrowed,
    address owner
  ) internal returns (uint256) {
    _registrarWriteAssumptions(caller, escrowed, 0, owner);

    _fundCallerApproveAddress(caller, DAI, escrowed, address(REGISTRAR));

    bytes memory hookData = abi.encode(
      uint256(1), // groupId
      uint8(1), // voterThreshold
      "Cereal Club", // title
      "Cereal Club is a DAO that buys cereal", // description
      "https://cerealclub.io", // externalURI
      "ipfs://QmbZzDcAbfnNqRCq4Ym4ygp1AEdNKN4vqgScUSzR2DZQcv" // imageURI
    );
    uint256 notaId = _registrarWriteHelper(
      caller, address(DAI), escrowed, 0, owner, HOOK, hookData
    );

    return notaId;
  }

  function testWrite(address caller, uint256 escrowed, address owner) public {
    _setupThenWrite(caller, escrowed, owner);
  }

  function testCashOwner(
    address caller,
    uint256 escrowed,
    address owner
  ) public {
    vm.assume(caller != owner);
    uint256 notaId = _setupThenWrite(caller, escrowed, owner);

    ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof({
      merkleTreeDepth: 0,
      merkleTreeRoot: 0,
      nullifier: 0,
      message: 0,
      scope: 0,
      points: [
        uint256(0),
        uint256(0),
        uint256(0),
        uint256(0),
        uint256(0),
        uint256(0),
        uint256(0),
        uint256(0)
      ]
    });
    _registrarCashHelper(caller, notaId, 100, owner, abi.encode(proof));
  }

  function testTokenURI(address caller, uint256 escrowed, address owner) public {
    vm.assume(caller != owner);
    uint256 notaId = _setupThenWrite(caller, escrowed, owner);

    // console.log(REGISTRAR.tokenURI(notaId));
  }
}
