"use client";

import { useState } from "react";
import { FC } from "react";
import { Identity } from "@semaphore-protocol/core";
import { Connector, signMessage } from "@wagmi/core";
import { Alchemy, Network } from "alchemy-sdk";
import { SignableMessage } from "viem";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { InputBase } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

interface SignMessageProps {
  connector: Connector | undefined;
  identityState: string | undefined;
  setIdentityState: (identity: Identity) => void;
  setGrantIdState: (grantId: string) => void;
  setNotaAdminState: (notaAdmin: string) => void;
  setNotaOwnerState: (notaOwner: string) => void;
  setGroupIdState: (notaMetadata: string) => void;
}

const SignMessage: FC<SignMessageProps> = ({
  connector,
  identityState,
  setIdentityState,
  setGrantIdState,
  setGroupIdState,
  setNotaAdminState,
  setNotaOwnerState,
}) => {
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
        "0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B", // denotaSDK.denotaContracts["registrar"].address  // TODO need this to be programmatic
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
    // console.log(notaMetadataJSON);
    const groupId = notaMetadataJSON["attributes"][3]["value"]; // TODO need to iterate through this list and pull out the item with this trait_type and then index it's value
    const admin = notaMetadataJSON["Committee Admin"];

    setGroupIdState(groupId);
    setGrantIdState(messageState);
    setNotaAdminState(admin);
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
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
      <IdentificationIcon className="h-8 w-8 fill-secondary" />
      {identityState ? (
        <div>
          Private Identity:
          <p className="flex-row break-all">{identityState}</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export { SignMessage };
