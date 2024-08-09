"use client";

import { getAccount, Config, signMessage } from '@wagmi/core'
import { useState} from "react";
import { SignableMessage } from 'viem' //recoverMessageAddress, 
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { Identity, Group, generateProof, verifyProof } from "@semaphore-protocol/core"
// import { Client } from "@xmtp/xmtp-js";
// import { set } from 'nprogress';

// import { InputBase } from "~~/components/scaffold-eth"; // Change to InputBase
export const SignMessage = () =>{
    const { connector } = getAccount(wagmiConfig);
    const [ messageState, setMessageState ] = useState('');
    const [ identityState, setIdentityState ] = useState('');

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
            onSubmit={async (event) => {
                event.preventDefault()
                const formData = new FormData(event.target as HTMLFormElement)
                const message = formData.get('message')?.toString()
                if (!message) {
                    return
                }
                const result = await signMessage(wagmiConfig, {
                    connector, 
                    message: message as SignableMessage,
                  })
                setMessageState(result)
                const identity = new Identity(messageState)
                setIdentityState(identity.commitment.toString())
                // await conversation.send(identity.commitment);
            }}
        >
        <label htmlFor="message">Enter a grant ID to create your identifier</label>
        <div>
          <textarea
              id="message"
              name="message"
              placeholder="Proposal Name..."
          />
        </div>
        {messageState ? 
          <div className='flex flex-col'>
            {/* <div>
              Signed Message (private key): {messageState}
            </div> */}
            <div>
              Private Identity: {identityState}
            </div>
          </div> : 
          <button className='flex' disabled={false}> {/* isLoading*/}Get Private Identifier</button>}
        
          {/* {messageState && } */}
          {/* {error && <div>{error.message}</div>} */}
        </form>
    </div>
  )
}