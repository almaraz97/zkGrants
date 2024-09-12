// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../lib/semaphore/packages/contracts/contracts/interfaces/ISemaphore.sol";
import
  "../lib/semaphore/packages/contracts/contracts/interfaces/ISemaphoreGroups.sol";
import "v1-periphery/BaseHook.sol";

// If the writer provides a 0 groupId the will be set as the admin of the group assigned that Nota
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

    if (groupId == 0) {
      groupId = _semaphore.createGroup(caller);
    }

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
          ',{"trait_type":"Committee Id","value":"',
          Strings.toString(notaData.groupId),
          '"},{"trait_type":"Committee Admin","value":"',
          Strings.toHexString(groupAdmin),
          '"},{"trait_type":"Vote Threshold","value":"',
          Strings.toString(notaData.voterThreshold),
          '"},{"trait_type":"Total Votes","value":"',
          Strings.toString(notaData.voteTotal),
          '"},{"trait_type":"Committee Size","value":"',
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
