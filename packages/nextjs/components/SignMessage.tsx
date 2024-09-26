"use client";

import { useState } from "react";
import { FC } from "react";
import { Group, Identity } from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { Connector, signMessage } from "@wagmi/core";
import { getEnsName, getEnsText } from "@wagmi/core";
import { Alchemy, Network } from "alchemy-sdk";
import { Address, SignableMessage } from "viem";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { InputBase } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

interface SignMessageProps {
  connector: Connector | undefined;
  semaphoreSubgraph: SemaphoreSubgraph | undefined;
  setIdentityState: (identity: Identity) => void;
  setGrantIdState: (grantId: string) => void;
  setNotaAdminState: (notaAdmin: string) => void;
  setAdminTelegramAddressState: (adminTelegramAddress: string) => void;
  setNotaOwnerState: (notaOwner: string) => void;
  setGroupIdState: (notaMetadata: string) => void;
  setGroupState: (group: Group) => void;
  setIsGroupMemberState: (isMember: boolean) => void;
}

const SignMessage: FC<SignMessageProps> = ({
  connector,
  semaphoreSubgraph,
  setIdentityState,
  setGrantIdState,
  setGroupIdState,
  setGroupState,
  setNotaAdminState,
  setAdminTelegramAddressState,
  setNotaOwnerState,
  setIsGroupMemberState,
}) => {
  const [messageState, setMessageState] = useState<string>("");
  const alchemy = new Alchemy({ apiKey: scaffoldConfig.alchemyApiKey, network: Network.ETH_SEPOLIA }); // TODO get this from the chainName

  const getNotaMetadata = async (notaId: string): Promise<string | undefined> => {
    const notaMetadata = (
      await alchemy.nft.getNftMetadata(
        "0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B", // denotaSDK.denotaContracts["registrar"].address  // TODO need this to be programmatic
        notaId,
      )
    ).raw.tokenUri;
    if (!notaMetadata) {
      console.error("No metadata found for token");
      return;
    }

    return Buffer.from(notaMetadata.split(",")[1], "base64").toString("utf-8");
  };
  const getTelegramAddress = async (admin: string): Promise<string | undefined> => {
    try {
      // TODO does this need a try and catch? Check failure modes of getEnsName and getEnsText
      const name = await getEnsName(wagmiConfig, { address: admin as Address });
      if (!name) return;
      const telegram = await getEnsText(wagmiConfig, { name: name, key: "org.telegram" });
      if (telegram) return telegram.toString();
    } catch (error) {
      console.error("Error fetching ENS record:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!messageState || !semaphoreSubgraph) {
      return;
    }
    const result = await signMessage(wagmiConfig, { connector, message: messageState as SignableMessage });
    if (!result) {
      console.error("No result from signing message");
      return;
    }
    const identity = new Identity(result);
    setIdentityState(identity);

    const notaOwner = await alchemy.nft.getOwnersForNft("0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B", messageState);
    setNotaOwnerState(notaOwner.owners[0]);
    setGrantIdState(messageState);

    const notaMetadata = await getNotaMetadata(messageState);
    if (!notaMetadata) {
      console.error("No metadata found for token");
      return;
    }
    const notaMetadataJSON = JSON.parse(notaMetadata);
    const groupId = notaMetadataJSON["attributes"][3]["value"]; // TODO need to iterate through this list and pull out the item with this trait_type and then index it's value
    const admin = notaMetadataJSON["attributes"][4]["value"];
    setGroupIdState(groupId);
    setNotaAdminState(admin);

    try {
      const { members } = await semaphoreSubgraph.getGroup(groupId, { members: true });
      const group = new Group(members);
      setGroupState(group);

      const isMember = group.indexOf(identity.commitment) !== -1;
      setIsGroupMemberState(isMember);

      if (!isMember) {
        const telegramAddress = await getTelegramAddress(admin);
        if (telegramAddress) setAdminTelegramAddressState(telegramAddress);
      }
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <>
      <IdentificationIcon className="h-8 w-8 fill-secondary" />
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
    </>
  );
};

export { SignMessage };
