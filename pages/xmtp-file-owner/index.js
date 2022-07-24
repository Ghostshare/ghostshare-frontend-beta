import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Client } from '@xmtp/xmtp-js';

export default function XMTP() {
  const [wallet, setWallet] = useState();
  const [provider, setProvider] = useState(null);
  const [xmtpClient, setXmtpClient] = useState(null);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    setProvider(
      new ethers.providers.InfuraProvider(
        "maticmum", // Mumbai Testnet
        process.env.NEXT_PUBLIC_INFURA_API_KEY
      )
    );
    const privateKey = localStorage.getItem("privateKey");
    const wallet = new ethers.Wallet(privateKey, provider);
    setWallet(wallet);
  }, []);

  const connectToXmtp = async () => {
    if (xmtpClient == null) {
      const xmtpClient = await Client.create(wallet);
      setXmtpClient(xmtpClient);
    }
  }

  const waitForConversation = async () => {
    if (xmtpClient == null) {
      alert("Please Create XMTP Client");
      return;
    }
    console.log("waitForConversation")
    const stream = await xmtpClient.conversations.stream()
    let newConversation;
    for await (const conversation of stream) {
      console.log(`New conversation started with ${conversation.peerAddress}`)
      setConversation(conversation);
      newConversation = conversation;
      // Say hello to your new friend
      // await conversation.send('Hi there!')
      // Break from the loop to stop listening
      break;
    }
    for await (const message of await newConversation.streamMessages()) {
      if (message.senderAddress === xmtpClient.address) {
        // This message was sent from me
        continue
      }
      console.log(`New message from ${message.senderAddress}: ${message.text}`)
      console.log("message:", message);
    }
  }
  
  return (
    <div style={{ padding: "50px 100px" }}>
      <h1> XMTP Communication</h1>
      <p>XMTP Connected: {((xmtpClient != null) ? <span style={{color: "green"}}>true</span> : <span style={{color: "red"}}>false</span> )}</p>
      <button name="connectToXmtp" onClick={connectToXmtp}>
          Create XMTP Client
        </button>
      <h3>
        My Wallet: {wallet?.address}
      </h3>
      <br/>
      <h2>File access requests</h2>
      <button name="waitForConversation" onClick={waitForConversation}>
          Wait for requests
      </button>
      <h3>Wallet address requesting file access: {conversation?.peerAddress}</h3>
      <br />
      <br/>
      
    </div>
  );
}
