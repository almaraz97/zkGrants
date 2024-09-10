"use client";

import { FC } from "react";
import { Group, Identity, generateProof } from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";

interface GenerateProofProps {
  identity: Identity | undefined;
  grantId: string | undefined;
}

const GenerateProof: FC<GenerateProofProps> = ({ identity, grantId }) => {
  const semaphoreSubgraph = new SemaphoreSubgraph("sepolia");

  return (
    <div className="flex flex-col">
      <form
        onSubmit={async event => {
          event.preventDefault();
          if (!identity || !grantId) {
            return;
          }

          const { members } = await semaphoreSubgraph.getGroup(grantId, { members: true });
          const group = new Group(members);

          const scope = group.root;
          const message = 1;
          const proof = await generateProof(identity, group, message, scope);
          console.log(proof);
        }}
      >
        <div>Cast vote onchain</div>
        <div>
          <button className="btn mt-2" disabled={false}>
            Vote to Release
          </button>
        </div>
      </form>
    </div>
  );
};

export { GenerateProof };
