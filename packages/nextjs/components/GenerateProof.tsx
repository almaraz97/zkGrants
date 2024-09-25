"use client";

import { FC } from "react";
import { Group, Identity, generateProof } from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { CheckIcon } from "@heroicons/react/24/outline";

// import { http, createConfig, writeContract } from '@wagmi/core'
// import { sepolia } from '@wagmi/core/chains'

interface GenerateProofProps {
  semaphoreSubgraph: SemaphoreSubgraph | undefined;
  identity: Identity | undefined;
  grantId: string | undefined;
  groupId: string | undefined;
  notaOwner: string | undefined;
}

const GenerateProof: FC<GenerateProofProps> = ({ semaphoreSubgraph, identity, grantId, groupId, notaOwner }) => {
  const generateProofAndVote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identity || !groupId || !grantId || !notaOwner || !semaphoreSubgraph) {
      return;
    }
    console.log(identity, groupId);

    const { members } = await semaphoreSubgraph.getGroup(groupId, { members: true });
    const group = new Group(members);

    const message = 1;
    const proof = await generateProof(identity, group, message, grantId);
    console.log(proof);

    // const config = createConfig({
    //   chains: [sepolia],
    //   transports: {
    //     [sepolia.id]: http(),
    //   },
    // })

    // const result = await writeContract(config, {
    //   abi: [], // TODO add denota abi
    //   address: '0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B',  // denotaSDK.denotaContracts["registrar"].address
    //   functionName: 'cash',
    //   args: [
    //     BigInt(grantId),
    //     BigInt(100), // TODO compute how much can be cashed
    //     `0x${notaOwner}`, // to
    //     // Need to abi.encode this
    //     // encodeAbiParameters(
    //     //   [
    //     //     { name: 'merkleTreeDepth', type: 'uint256' },
    //     //     { name: 'merkleTreeRoot', type: 'uint256' },
    //     //     // { name: 'z', type: 'bool' }
    //     //   ],
    //     //   // [BigInt(proof.merkleTreeDepth), proof.merkleTreeRoot, proof.nullifier, proof.scope, proof.points]
    //     // ),
    //     `0x{proof}`, // TODO insert proof here
    //   ],
    // })
  };

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
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
    </div>
  );
};

export { GenerateProof };
