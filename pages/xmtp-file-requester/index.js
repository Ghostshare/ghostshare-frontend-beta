import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import { getXmtpEnv } from "../../src/utils/xmtp/xmtp-env";
import * as GSXmtpMsgProtocol from "../../src/utils/xmtp/xmtp-msg-protocol"

export default function XMTPFileRequester() {
  const [fileOwnerAddress, setFileOwnerAddress] = useState("");
  const [wallet, setWallet] = useState();
  const [provider, setProvider] = useState(null);
  const [xmtpClient, setXmtpClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [fileAccessStatus, setFileAccessStatus] = useState("Not requested");
  const [fileCID, setFileCID] = useState("");

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
        return
      }
      console.log("XMTP env: ", getXmtpEnv());
      setXmtpClient(await Client.create(wallet, { env: getXmtpEnv() }));
    };
    initXmtpClient();
  }, []);

  const handleFileOwnerAddress = (e) => {
    setFileOwnerAddress(e.target.value);
  };

  const handleFileCID = (e) => {
    setFileCID(e.target.value);
  };

  const connectToFileOwner = async () => {
    if (xmtpClient == null) {
      alert("Please Create XMTP Client");
      return;
    }
    if (fileOwnerAddress == "") {
      alert("Please enter file owner wallet address");
      return;
    } 
    setConversation(await xmtpClient.conversations.newConversation(fileOwnerAddress));
  };

  useEffect(() => {
    if (conversation == null) return;
    sendHi();
  }, [conversation]);

  const sendHi = async () => {
    console.log("sending Hi!");
    await conversation.send("#Ghostshare:hi!");
  };

  const requestAccess = async () => {
    if (conversation != null) {
      const reqMsg = GSXmtpMsgProtocol.buildFileAccessRequestMessage(fileCID, wallet?.address);
      console.log("requesting file access:", reqMsg);
      await conversation.send(reqMsg);
      waitForFileAccessRequestResponse();
    }
  };

  const waitForFileAccessRequestResponse = async () => {
    if (xmtpClient == null) {
      console.warn("Please wait for XMTP Client creation");
      return;
    }
    if (conversation != null) {
      console.log("waitForFileAccessRequestResponse")      
      for await (const message of await conversation.streamMessages()) {
        if (message.senderAddress === xmtpClient.address) {
          // This message was sent from me
          continue
        }
        console.log(`New message from ${message.senderAddress}: ${message.content}`)
        if (GSXmtpMsgProtocol.isFileAccessGrantedMessage(message)) {
        // If we are processing an access granted message
          setFileAccessStatus("Access granted");
          const payloadData = GSXmtpMsgProtocol.extractFileAccessGrantedData(message);
          console.log("got access granted to FileCID:", payloadData.requestedFileCID)
          // break listening for messages loop since we are done with our request
          break;
        } else if (GSXmtpMsgProtocol.isFileAccessDeniedMessage(message)) {
          // If we are processing an access denied message
          setFileAccessStatus("Access denied");          
          const payloadData = GSXmtpMsgProtocol.extractFileAccessDeniedData(message);
          console.log("got access denied to FileCID:", payloadData.requestedFileCID)
          // break listening for messages loop since we are done with our request
          break;
        }
        // Continue listening for messages
      }
    }
  };

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  return (
    <div style={{ padding: "50px 100px" }}>
      <h1> XMTP Communication</h1>
      <p>XMTP Connected: {((xmtpClient != null) ? <span style={{color: "green"}}>true</span> : <span style={{color: "red"}}>false</span> )}</p>
      <h3>
        My Wallet: {wallet?.address}
      </h3>
      <br/>
      <h2>Request file access</h2>
      <div>
        <h3>
          File Owner Wallet: {fileOwnerAddress}
        </h3>
        <br />
        <label style={{ paddingRight: "10px" }}>File Owner Walet Address</label>
        <input
          value={fileOwnerAddress}
          placeholder="address you want to chat with"
          style={{ width: "500px" }}
          onChange={handleFileOwnerAddress}
        />
        <br />
        <br />
        <label style={{ paddingRight: "10px" }}>Request access to file</label>
        <input
          value={fileCID}
          placeholder="encrypted file cid"
          style={{ width: "500px" }}
          onChange={handleFileCID}
        />
        <br />
        <br />
        <button name="connectToFileOwner" onClick={connectToFileOwner}>
          Connect to File Owner
        </button>
        <br />
        <br />
        <button name="requestAccess" onClick={requestAccess}>
          Request File Access
        </button>
        <br/>
        <p>File acccess status: <span style={{fontWeight: "bold"}}>{fileAccessStatus}</span></p>
        <br/>
      </div>
      <br/>
      <br/>
    </div>
  );
}
