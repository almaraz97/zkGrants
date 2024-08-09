"use client";

import { Group, Identity, generateProof } from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";

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
          <label htmlFor="pk">Enter Your identity</label>
          <textarea id="pk" name="pk" placeholder="Private Identifier..." />
        </div>
        <div>
          <label htmlFor="groupId">Enter the grant ID</label>
          <textarea id="groupId" name="groupId" placeholder="Grant ID..." />
          <button className="flex" disabled={false}>
            Vote to Release Funds
          </button>
        </div>
      </form>
    </div>
  );
};
