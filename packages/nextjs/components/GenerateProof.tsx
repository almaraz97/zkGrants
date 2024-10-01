"use client";

import { FC } from "react";
import { Group, Identity, SemaphoreProof, generateProof } from "@semaphore-protocol/core";
import { writeContract } from "@wagmi/core";
import { Address, encodeAbiParameters } from "viem";
import { CheckIcon } from "@heroicons/react/24/outline";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

interface GenerateProofProps {
  group: Group | undefined;
  identity: Identity | undefined;
  grantId: string | undefined;
  groupId: string | undefined;
  notaOwner: string | undefined;
}

const GenerateProof: FC<GenerateProofProps> = ({ group, identity, grantId, groupId, notaOwner }) => {
  const generateProofAndVote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identity || !groupId || !grantId || !notaOwner || !group) {
      return;
    }
    console.log(identity, groupId);

    const message = 1;
    const proof: SemaphoreProof = await generateProof(identity, group, message, grantId);
    console.log(proof);

    if (!proof) return;
    const unpackedProofPoints: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint] = [
      BigInt(proof.points[0]),
      BigInt(proof.points[1]),
      BigInt(proof.points[3]),
      BigInt(proof.points[2]),
      BigInt(proof.points[5]),
      BigInt(proof.points[4]),
      BigInt(proof.points[6]),
      BigInt(proof.points[7]),
    ];

    const encodedProof = encodeAbiParameters(
      // hookData
      [
        { name: "merkleTreeDepth", type: "uint256" },
        { name: "merkleTreeRoot", type: "uint256" },
        { name: "nullifier", type: "uint256" },
        { name: "message", type: "uint256" },
        { name: "scope", type: "uint256" },
        { name: "points", type: "uint256[8]" },
      ],
      [
        BigInt(proof.merkleTreeDepth),
        BigInt(proof.merkleTreeRoot),
        BigInt(proof.nullifier),
        BigInt(proof.message),
        BigInt(proof.scope),
        unpackedProofPoints,
      ],
    );
    console.log(encodedProof);

    const result = await writeContract(wagmiConfig, {
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "notaId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "hookData",
              type: "bytes",
            },
          ],
          name: "cash",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ], // TODO add denota abi
      address: "0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B", // denotaSDK.contractMappingForChainId(chainName).registrar
      functionName: "cash",
      args: [
        BigInt(grantId), // notaId
        BigInt(100), // amount // TODO auto-compute how much can be cashed
        notaOwner as Address, // to
        encodedProof,
      ],
    });

    window.alert(`Vote casted: ${result}`);
  };

  return (
    <>
      <CheckIcon className="h-8 w-8 fill-secondary" />
      <div className="flex flex-col">
        <form onSubmit={generateProofAndVote}>
          <div>Cast vote onchain</div>
          <div>
            <button className="btn mt-2" disabled={false}>
              Vote to Release
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export { GenerateProof };
