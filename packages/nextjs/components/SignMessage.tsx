"use client";

import { useState } from "react";
import { FC } from "react";
import { Identity } from "@semaphore-protocol/core";
import { getAccount, signMessage } from "@wagmi/core";
import { Alchemy, Network } from "alchemy-sdk";
import { SignableMessage } from "viem";
import { InputBase } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

interface SignMessageProps {
  setIdentityState: (identity: Identity) => void;
  setGrantIdState: (grantId: string) => void;
  setNotaOwnerState: (notaOwner: string) => void;
  setGroupIdState: (notaMetadata: string) => void;
}

const SignMessage: FC<SignMessageProps> = ({
  setIdentityState,
  setGrantIdState,
  setGroupIdState,
  setNotaOwnerState,
}) => {
  const { connector } = getAccount(wagmiConfig);
  const [messageState, setMessageState] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!messageState) {
      return;
    }
    const alchemy = new Alchemy({
      apiKey: scaffoldConfig.alchemyApiKey,
      network: Network.ETH_SEPOLIA,
    });

    const notaMetadata = (
      await alchemy.nft.getNftMetadata(
        "0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B", // denotaSDK.denotaContracts["registrar"].address
        messageState,
      )
    ).raw.tokenUri;

    if (!notaMetadata) {
      console.error("No metadata found for token");
      return;
    }
    const notaOwner = await alchemy.nft.getOwnersForNft("0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B", messageState);
    setNotaOwnerState(notaOwner.owners[0]);

    const notaMetadataJSON = JSON.parse(Buffer.from(notaMetadata.split(",")[1], "base64").toString("utf-8"));
    console.log(notaMetadataJSON);
    const groupId = notaMetadataJSON["attributes"][3]["value"]; // TODO need to iterate through this list and pull out the item with this trait_type and then index it's value

    setGroupIdState(groupId);
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
            <label htmlFor="message">Enter the grant ID to create your private identifier:</label>
          </div>
          <InputBase name="message" placeholder="Grant ID" value={messageState} onChange={setMessageState} />
          <button className="btn mt-2">Get Identity</button>
        </div>
      </form>
    </div>
  );
};

export { SignMessage };
