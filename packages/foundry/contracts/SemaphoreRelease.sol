// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../lib/semaphore/packages/contracts/contracts/interfaces/ISemaphore.sol";
import
  "../lib/semaphore/packages/contracts/contracts/interfaces/ISemaphoreGroups.sol";
import "v1-periphery/BaseHook.sol";

/**
 * Ways to combine releases
 * - Linear
 * - Cliff
 * - Cliff --> linear
 * - Zero if vote threshold not reached, and max payout within a time, after that time payout reduces linearly
 *
 * Vote threshold, grace period to get threshold, then linear decay
 */
/**
 * Assume group already exists?
 * Assume all members have already joined?
 * Assume all money is escrowed already?
 * Assume more members won't join?
 * Assume each signature is sent here before passing to the Semaphore contract?
 * Assume a vote is a yes and not voting is a no? No negative votes.
 */
contract SemaphoreRelease is BaseHook {
  struct NotaData {
    uint256 grantAmount;
    uint256 groupId;
    uint8 voterThreshold;
    uint8 voteTotal;
    string title;
    string description;
    string externalURI;
    string imageURI;
  }

  mapping(uint256 => NotaData) public notaDatas;
  ISemaphore public _semaphore;

  error NotEnoughVotes();
  error ZeroVoterThreshold();

  event GrantCreated(
    uint256 indexed notaId,
    address indexed caller,
    uint256 indexed groupId,
    uint8 voterThreshold,
    string title,
    string description,
    string externalURI,
    string imageURI
  );

  constructor(address registrar) BaseHook(registrar) {
    _semaphore = ISemaphore(0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f);
  }

  /**
   * @notice (uin256 groupId, uint32 threshold, string title, string description, string externalURI, string imageURI)
   */
  function beforeWrite(
    address caller,
    NotaState calldata nota,
    uint256, /*instant*/
    bytes calldata hookData
  ) external override returns (bytes4, uint256) {
    (
      uint256 groupId,
      uint8 voterThreshold,
      string memory title,
      string memory description,
      string memory externalURI,
      string memory imageURI
    ) = abi.decode(hookData, (uint256, uint8, string, string, string, string));
    if (voterThreshold == 0) revert ZeroVoterThreshold();

    notaDatas[nota.id] = NotaData(
      nota.escrowed,
      groupId,
      voterThreshold,
      0,
      title,
      description,
      externalURI,
      imageURI
    );
    if (
      ISemaphoreGroups(address(_semaphore)).getGroupAdmin(groupId) == address(0)
    ) _semaphore.createGroup(caller);

    emit GrantCreated(
      nota.id,
      caller,
      groupId,
      voterThreshold,
      title,
      description,
      externalURI,
      imageURI
    );
    return (this.beforeWrite.selector, 0);
  }

  function beforeCash(
    address, /*caller*/
    NotaState calldata nota,
    address to,
    uint256 amount,
    bytes calldata hookData
  ) external override onlyRegistrar returns (bytes4, uint256) {
    NotaData storage notaData = notaDatas[nota.id];
    require(to == nota.owner, "Only to owner");
    if (notaData.voteTotal >= notaData.voterThreshold) {
      return (this.beforeCash.selector, 0);
    }

    ISemaphore.SemaphoreProof memory proof =
      abi.decode(hookData, (ISemaphore.SemaphoreProof));
    require(proof.scope == nota.id, "Invalid scope");
    ISemaphore(_semaphore).validateProof(notaData.groupId, proof);

    notaData.voteTotal += 1;
    if (amount > (notaData.grantAmount / notaData.voterThreshold)) {
      revert NotEnoughVotes();
    }

    return (this.beforeCash.selector, 0);
  }

  function beforeTokenURI(
    address, /*caller*/
    NotaState calldata nota
  ) external view override returns (bytes4, string memory, string memory) {
    NotaData memory notaData = notaDatas[nota.id];
    uint256 size =
      ISemaphoreGroups(address(_semaphore)).getMerkleTreeSize(notaData.groupId);
    address groupAdmin =
      ISemaphoreGroups(address(_semaphore)).getGroupAdmin(notaData.groupId);

    return (
      this.beforeTokenURI.selector,
      string(
        abi.encodePacked(
          ',{"trait_type":"Group Id","value":"',
          Strings.toString(notaData.groupId),
          '"},{"trait_type":"Group Admin","value":"',
          Strings.toHexString(groupAdmin),
          '"},{"trait_type":"Vote Threshold","value":"',
          Strings.toString(notaData.voterThreshold),
          '"},{"trait_type":"Votes","value":"',
          Strings.toString(notaData.voteTotal),
          '"},{"trait_type":"Group Size","value":"',
          Strings.toString(size),
          '"}'
        )
      ),
      string(
        abi.encodePacked(
          ',"name":"',
          notaData.title,
          '","description":"',
          notaData.description,
          '","image":"',
          notaData.imageURI,
          '","external_url":"',
          notaData.externalURI,
          '"'
        )
      )
    );
  }
}
