"use client";

import { useState } from "react";
import { Identity } from "@semaphore-protocol/core";
import { getAccount, signMessage } from "@wagmi/core";
import { SignableMessage } from "viem";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

// import { Client } from "@xmtp/xmtp-js";
// import { set } from 'nprogress';

// import { InputBase } from "~~/components/scaffold-eth"; // Change to InputBase
export const SignMessage = () => {
  const { connector } = getAccount(wagmiConfig);
  const [messageState, setMessageState] = useState("");
  const [identityState, setIdentityState] = useState("");

  // const signer = ""
  // // Create the client with your wallet. This will connect to the XMTP development network by default
  // const xmtp = await Client.create(signer, { env: "dev" });
  // // Start a conversation with XMTP
  // const conversation = await xmtp.conversations.newConversation(
  // "0xd20E342dB297646a500A980088723C9E8af9810d",  // almaraz.eth
  // );

  return (
    <div className="flex flex-col">
      <form
        onSubmit={async event => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          const message = formData.get("message")?.toString();
          if (!message) {
            return;
          }
          const result = await signMessage(wagmiConfig, {
            connector,
            message: message as SignableMessage,
          });
          setMessageState(result);
          const identity = new Identity(messageState);
          setIdentityState(identity.commitment.toString());
          // await conversation.send(identity.commitment);
        }}
      >
        <label htmlFor="message">Enter a grant name to create your private identifier:</label>
        <div>
          <textarea id="message" name="message" placeholder="pse-24" />
        </div>
        {messageState ? (
          <div className="flex flex-col">
            {/* <div>
              Signed Message (private key): {messageState}
            </div> */}
            <div>
              Private Identity:
              <p className="width: 100%">{identityState}</p>
            </div>
          </div>
        ) : (
          <button className="flex flex-col text-center items-center max-w-xs rounded-3xl">[Get Credentials]</button>
        )}
        {/* {messageState && } */}
        {/* {error && <div>{error.message}</div>} */}
      </form>
    </div>
  );
};
