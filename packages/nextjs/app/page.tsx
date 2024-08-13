"use client";

import type { NextPage } from "next";
import { CheckIcon, IdentificationIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { GenerateProof } from "~~/components/GenerateProof";
import { SignMessage } from "~~/components/SignMessage";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">zkGrants</span>
          </h1>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <IdentificationIcon className="h-8 w-8 fill-secondary" />
              <SignMessage></SignMessage>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <PaperAirplaneIcon className="h-8 w-8 fill-secondary" />
              Send ID to grant admin to register in the grant voting group.
              <a href="https://web.telegram.org/a/#6147260775" target="_blank" rel="noreferrer noopener">
                [Open Telegram]
              </a>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <CheckIcon className="h-8 w-8 fill-secondary" />
              {/* <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p> */}
              <GenerateProof></GenerateProof>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
