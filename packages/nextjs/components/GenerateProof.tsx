"use client";

import { Group, Identity, generateProof } from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { InputBase } from "~~/components/scaffold-eth";

export const GenerateProof = () => {
  const semaphoreSubgraph = new SemaphoreSubgraph("sepolia");

  return (
    <div className="flex flex-col">
      <form
        onSubmit={async event => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          const pk = formData.get("pk")?.toString();
          const groupId = formData.get("groupId")?.toString();
          console.log(pk, groupId);
          if (!pk || !groupId) {
            return;
          }

          const identity = new Identity(pk);
          // setIdentityState(identity)
          const { members } = await semaphoreSubgraph.getGroup(groupId, { members: true });
          // setGroupState(members);
          const group = new Group(members);
          console.log(group);

          const scope = group.root;
          const message = 1;
          const proof = await generateProof(identity, group, message, scope);
          console.log(proof);
        }}
      >
        <div>
          Cast vote onchain
          <InputBase name="pk" value="Private Identifier..." onChange={() => null} />
        </div>
        <div>
          <InputBase name="groupId" value="Grant ID" onChange={() => null} />
          <button className="btn mt-2" disabled={false}>
            Vote to Release
          </button>
        </div>
      </form>
    </div>
  );
};
