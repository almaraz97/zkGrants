"use client";

import { useState } from "react";
import { Identity } from "@semaphore-protocol/core";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { GenerateProof } from "~~/components/GenerateProof";
import { JoinGroup } from "~~/components/JoinGroup";
import { SignMessage } from "~~/components/SignMessage";

const Home: NextPage = () => {
  const [identityState, setIdentityState] = useState<Identity>();
  const [groupIdState, setGroupIdState] = useState<string>("");
  const [notaIdState, setNotaIdState] = useState<string>("");
  const [notaAdminState, setNotaAdminState] = useState<string>("");
  const [notaOwnerState, setNotaOwnerState] = useState<string>("");
  const account = useAccount();

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <SignMessage
            connector={account.connector}
            identityState={identityState?.commitment.toString()}
            setIdentityState={setIdentityState}
            setGrantIdState={setNotaIdState}
            setGroupIdState={setGroupIdState}
            setNotaAdminState={setNotaAdminState}
            setNotaOwnerState={setNotaOwnerState}
          />
          <JoinGroup accountState={account.address} notaAdminState={notaAdminState} />
          <GenerateProof
            chainName={account.chain?.name.toString()}
            identity={identityState}
            grantId={notaIdState}
            groupId={groupIdState}
            notaOwner={notaOwnerState}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
