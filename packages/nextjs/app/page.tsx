"use client";

import { useState } from "react";
import { Identity } from "@semaphore-protocol/core";
import type { NextPage } from "next";
import { CheckIcon, IdentificationIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { GenerateProof } from "~~/components/GenerateProof";
import { SignMessage } from "~~/components/SignMessage";

const Home: NextPage = () => {
  const [identityState, setIdentityState] = useState<Identity>();
  const [grantIdState, setGrantIdState] = useState<string>();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <IdentificationIcon className="h-8 w-8 fill-secondary" />
              {identityState ? (
                <div>
                  Private Identity:
                  <p className="flex-row break-all">{identityState.commitment.toString()}</p>
                </div>
              ) : (
                <SignMessage setIdentityState={setIdentityState} setGrantIdState={setGrantIdState} />
              )}
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <PaperAirplaneIcon className="h-8 w-8 fill-secondary" />
              Send private ID through Telegram to the group admin
              <a href="https://web.telegram.org/a/#6147260775" target="_blank" rel="noreferrer noopener">
                {/* https://web.telegram.org/a/{grantIdState}#?text=/register {identityState.toString()} */}
                <button className="btn mt-2">Join Group</button>
              </a>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <CheckIcon className="h-8 w-8 fill-secondary" />
              <GenerateProof identity={identityState} grantId={grantIdState} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
