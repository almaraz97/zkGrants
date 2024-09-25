"use client";

import { useState } from "react";
import { Identity } from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { getAccount } from "@wagmi/core";
import type { NextPage } from "next";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { GenerateProof } from "~~/components/GenerateProof";
import { SignMessage } from "~~/components/SignMessage";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

// TODO add programmatic semaphore subgraph based on chain connected
// TODO get ENS records of the TG account and if not found, use XMTP

const Home: NextPage = () => {
  const { connector } = getAccount(wagmiConfig);
  const [identityState, setIdentityState] = useState<Identity>();
  const [groupIdState, setGroupIdState] = useState<string>("");
  const semaphoreSubgraph = new SemaphoreSubgraph("sepolia"); // TODO need this programmatic
  const [notaIdState, setNotaIdState] = useState<string>("");
  const [notaOwnerState, setNotaOwnerState] = useState<string>("");
  // const adminAddress = notaMetadataJSON.get("Committee Admin");
  // XMTPClient.send(adminAddress, identityState, groupId);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <SignMessage
            connector={connector}
            identityState={identityState?.commitment.toString()}
            setIdentityState={setIdentityState}
            setGrantIdState={setNotaIdState}
            setGroupIdState={setGroupIdState}
            setNotaOwnerState={setNotaOwnerState}
          />
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <PaperAirplaneIcon className="h-8 w-8 fill-secondary" />
            Send private ID through Telegram to the group admin
            <a href="https://web.telegram.org/a/#6147260775" target="_blank" rel="noreferrer noopener">
              {/* TODO need telegram fetched here */}
              <button className="btn mt-2">Join Group</button>
            </a>
          </div>
          <GenerateProof
            identity={identityState}
            grantId={notaIdState}
            groupId={groupIdState}
            notaOwner={notaOwnerState}
            semaphoreSubgraph={semaphoreSubgraph}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
