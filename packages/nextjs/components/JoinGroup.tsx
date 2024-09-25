import React, { FC, useEffect, useState } from "react";
import { getDefaultProvider } from "@ethersproject/providers";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// import { Client } from "@xmtp/xmtp-js";

interface JoinGroupProps {
  accountState: string | undefined;
  notaAdminState: string | undefined;
}

const JoinGroup: FC<JoinGroupProps> = ({ accountState, notaAdminState }) => {
  const [telegramAddress, setTelegramAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchTelegramAddress = async () => {
      if (!accountState || !notaAdminState) return;

      try {
        const provider = getDefaultProvider();
        const resolver = await provider.getResolver(accountState.toString()); // notaAdminState
        console.log(resolver);
        const telegram = await resolver?.getText("telegram");
        console.log("Telegram:", telegram);
        setTelegramAddress(telegram || null);
      } catch (error) {
        console.error("Error fetching ENS record:", error);
      }
    };

    fetchTelegramAddress();
  }, [accountState, notaAdminState]);

  const sendXMTPMessage = async () => {
    // try {
    //   const xmtp = await Client.create(accountState);
    //   const conversation = await xmtp.conversations.newConversation(notaAdminState);
    //   await conversation.send("Send private ID through Telegram to the group admin");
    // } catch (error) {
    //   console.error("Error sending XMTP message:", error);
    // }
  };

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
      <PaperAirplaneIcon className="h-8 w-8 fill-secondary" />
      Send private ID through Telegram to the group admin
      {telegramAddress ? (
        <a href={`https://t.me/${telegramAddress}`} target="_blank" rel="noreferrer noopener">
          <button className="btn mt-2">Join Group</button>
        </a>
      ) : (
        <button className="btn mt-2" onClick={sendXMTPMessage}>
          Join Group
        </button>
      )}
    </div>
  );
};

export { JoinGroup };
