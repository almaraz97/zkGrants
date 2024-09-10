"use client";

import { useState } from "react";
import { FC } from "react";
import { Identity } from "@semaphore-protocol/core";
import { getAccount, signMessage } from "@wagmi/core";
import { SignableMessage } from "viem";
import { InputBase } from "~~/components/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

interface SignMessageProps {
  setIdentityState: (identity: Identity) => void;
  setGrantIdState: (grantId: string) => void;
}

const SignMessage: FC<SignMessageProps> = ({ setIdentityState, setGrantIdState }) => {
  const { connector } = getAccount(wagmiConfig);
  const [messageState, setMessageState] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!messageState) {
      return;
    }

    setGrantIdState(messageState);
    try {
      const result = await signMessage(wagmiConfig, {
        connector,
        message: messageState as SignableMessage,
      });
      const identity = new Identity(result);
      setIdentityState(identity);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="mb-2">
            <label htmlFor="message">Enter a grant name to create your private identifier:</label>
          </div>
          <InputBase name="message" placeholder="Grant ID" value={messageState} onChange={setMessageState} />
          <button className="btn mt-2">Get Identity</button>
        </div>
      </form>
    </div>
  );
};

export { SignMessage };
