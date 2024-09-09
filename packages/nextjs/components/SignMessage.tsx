"use client";

import { useState } from "react";
import { Identity } from "@semaphore-protocol/core";
import { getAccount, signMessage } from "@wagmi/core";
import { SignableMessage } from "viem";
import { InputBase } from "~~/components/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export const SignMessage = () => {
  const { connector } = getAccount(wagmiConfig);
  const [messageState, setMessageState] = useState<string>();
  const [signedMessageState, setSignedMessageState] = useState<string>();
  const [identityState, setIdentityState] = useState<string>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const message = formData.get("message")?.toString();
    if (!message) {
      return;
    }
    try {
      const result = await signMessage(wagmiConfig, {
        connector,
        message: message as SignableMessage,
      });
      setSignedMessageState(result);
      const identity = new Identity(signedMessageState);
      setIdentityState(identity.commitment.toString());
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit}>
        {signedMessageState ? (
          <div>
            Private Identity:
            <p className="flex-row break-all">{identityState}</p>
          </div>
        ) : (
          <div>
            <div className="mb-2">
              <label htmlFor="message">Enter a grant name to create your private identifier:</label>
            </div>
            <InputBase name="message" placeholder="pse-24" value={messageState} onChange={setMessageState} />
            <button className="btn mt-2">Get Identity</button>
          </div>
        )}
      </form>
    </div>
  );
};
