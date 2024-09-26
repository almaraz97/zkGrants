"use client";

import { useState } from "react";
import { Group, Identity } from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { GenerateProof } from "~~/components/GenerateProof";
import { JoinGroup } from "~~/components/JoinGroup";
import { SignMessage } from "~~/components/SignMessage";

// import { isSupportedNetwork } from "@semaphore-protocol/utils";

const Home: NextPage = () => {
  const [identityState, setIdentityState] = useState<Identity>();
  const [notaIdState, setNotaIdState] = useState<string>("");
  const [notaOwnerState, setNotaOwnerState] = useState<string>("");
  const [groupIdState, setGroupIdState] = useState<string>("");
  const [groupState, setGroupState] = useState<Group>();
  const [notaAdminState, setNotaAdminState] = useState<string>("");
  const [isGroupMemberState, setIsGroupMemberState] = useState<boolean>(false);
  const [adminTelegramAddressState, setAdminTelegramAddressState] = useState<string>("");

  const account = useAccount();
  const semaphoreSubgraph = new SemaphoreSubgraph(account.chain?.name.toString().replace(" ", "-").toLowerCase());

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            {!identityState ? (
              <SignMessage
                connector={account.connector}
                semaphoreSubgraph={semaphoreSubgraph}
                setIdentityState={setIdentityState}
                setGrantIdState={setNotaIdState}
                setGroupIdState={setGroupIdState}
                setGroupState={setGroupState}
                setNotaOwnerState={setNotaOwnerState}
                setNotaAdminState={setNotaAdminState}
                setAdminTelegramAddressState={setAdminTelegramAddressState}
                setIsGroupMemberState={setIsGroupMemberState}
              />
            ) : !isGroupMemberState ? (
              <JoinGroup
                accountAddress={account.address}
                notaAdmin={notaAdminState}
                adminTelegramAddress={adminTelegramAddressState}
              />
            ) : (
              <GenerateProof
                identity={identityState}
                grantId={notaIdState}
                groupId={groupIdState}
                group={groupState}
                notaOwner={notaOwnerState}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
