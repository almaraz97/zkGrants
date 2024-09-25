import React from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const JoinGroup = ({}) => {
  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
      <PaperAirplaneIcon className="h-8 w-8 fill-secondary" />
      Send private ID through Telegram to the group admin
      <a href="https://web.telegram.org/a/#6147260775" target="_blank" rel="noreferrer noopener">
        {/* TODO need telegram fetched here */}
        <button className="btn mt-2">Join Group</button>
      </a>
    </div>
  );
};

export { JoinGroup };
