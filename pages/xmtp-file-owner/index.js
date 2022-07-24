import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Client } from '@xmtp/xmtp-js';

export default function XMTP() {
  const [wallet, setWallet] = useState();
  const [provider, setProvider] = useState(null);
  const [xmtpClient, setXmtpClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [requestedFileCID, setRequestedFileCID] = useState("");
  const [stream, setStream] = useState(null);

  const ghostshareFileAccessRequestPrefix = "#Ghostshare:request-accesss:file-cid:";
  const ghostshareFileAccessGrantedPrefix = "#Ghostshare:accesss-granted:file-cid:";
  const ghostshareFileAccessDeniedPrefix = "#Ghostshare:accesss-denied:file-cid:";
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
    const initXmtpClient = async () => {
      if (!wallet) {
        console.error("no wallet available");
        return;
      }
      setXmtpClient(await Client.create(wallet));
    }
    initXmtpClient()
  }, []);
  
  useEffect(() => {
    if (xmtpClient == null) return;
    waitForConversation();
  }, [xmtpClient]);
  
  useEffect(() => {
    if (stream == null) return;
    processStream();
  }, [stream]);
  
  const processStream = async () => {
    console.log("processing stream");
    for await (const conversation of stream) {
      console.log(`New conversation started with ${conversation.peerAddress}`)
      setConversation(conversation);
      break;
    }
  };

  const waitForConversation = async () => {
    if (xmtpClient == null) {
      console.warn("Please wait for XMTP Client creation");
      return;
    }
    console.log("waitForConversation")
    const stream = await xmtpClient.conversations.stream()
    setStream(stream);
  }
    
  useEffect(() => {
    if (conversation == null) return;
    listenToConversation();
  }, [conversation]);
  
  const listenToConversation = async () => {
    for await (const message of await conversation.streamMessages()) {
      if (message.senderAddress === xmtpClient.address) {
        // This message was sent from me
        continue
      }
      console.log(`New message from ${message.senderAddress}: ${message.content}`)
      if (message.content.startsWith(ghostshareFileAccessRequestPrefix)) {
        const requestedFileCID = message.content.slice(ghostshareFileAccessRequestPrefix.length);
        console.log("requestedFileCID:", requestedFileCID)
        setRequestedFileCID(message.content.slice(ghostshareFileAccessRequestPrefix.length));
        break;
      }
    }
  }

  const grantAccess = async () => {
    if (conversation == null) {
      console.warn("Please wait for conversation to be setup");
      return;
    }
    console.log("grant access")
    conversation.send(ghostshareFileAccessGrantedPrefix +  requestedFileCID);
  }

  const denyAccess = async () => {
    if (conversation == null) {
      console.warn("Please wait for conversation to be setup");
      return;
    }
    console.log("deny access")
    conversation.send(ghostshareFileAccessDeniedPrefix +  requestedFileCID);
  }


  return (
    <div style={{ padding: "50px 100px" }}>
      <h1> XMTP Communication</h1>
      <p>XMTP Connected: {(xmtpClient != null) ? <span style={{color: "green"}}>true</span> : <span style={{color: "red"}}>false</span>}</p>
      <h3>
        My Wallet: {wallet?.address}
      </h3>
      <br/>
      <h2>File access requests</h2>
      <p style={{display: (xmtpClient != null) ? "block" : "none"}}>Waiting for requests...</p>
      <br />
      <p>Wallet address requesting file access: {conversation?.peerAddress}</p>
      <p>File CID being requested: {requestedFileCID}</p>
      <button name="grantAccess" onClick={grantAccess}>Grant</button>
      <br/>
      <button name="denyAccess" onClick={denyAccess}>Deny</button>
      <br/>
    </div>
  );
}
