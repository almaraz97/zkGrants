import { FC } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// import { Client } from "@xmtp/xmtp-js";

interface JoinGroupProps {
  accountAddress: string | undefined;
  notaAdmin: string | undefined;
  adminTelegramAddress: string | undefined;
}

const JoinGroup: FC<JoinGroupProps> = ({ accountAddress, notaAdmin, adminTelegramAddress }) => {
  const sendXMTPMessage = async () => {
    try {
      console.log(accountAddress, notaAdmin);
      //   const xmtp = await Client.create(accountAddress);
      //   const conversation = await xmtp.conversations.newConversation(notaAdmin);
      //   await conversation.send(Hey, add me to the voting group {ID}, {privateId}!);
    } catch (error) {
      console.error("Error sending XMTP message:", error);
    }
  };

  return (
    <>
      <PaperAirplaneIcon className="h-8 w-8 fill-secondary" />
      Send the admin your private ID to be added to the voting group.
      {/* TODO put privateId in here so they can copy and paste. Can auto send it */}
      {adminTelegramAddress ? (
        <a href={`https://t.me/${adminTelegramAddress}`} target="_blank" rel="noreferrer noopener">
          <button className="btn mt-2">Admin&apos;s Telegram</button>
        </a>
      ) : (
        <button className="btn mt-2" onClick={sendXMTPMessage}>
          Admin&apos;s XMTP
        </button>
      )}
    </>
  );
};

export { JoinGroup };
