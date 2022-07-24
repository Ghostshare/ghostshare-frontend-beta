import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Client } from '@xmtp/xmtp-js';

export default function XMTP() {
  const [fileOwnerAddress, setFileOwnerAddress] = useState("");
  const [wallet, setWallet] = useState();
  const [provider, setProvider] = useState(null);
  const [xmtpClient, setXmtpClient] = useState(null);
  const [conversation, setConversation] = useState(null);

  const fileCID = "";

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

  const handleFileOwnerAddress = (e) => {
    setFileOwnerAddress(e.target.value);
  };

  const connectToXmtp = async () => {
    if (xmtpClient == null) {
      const xmtpClient = await Client.create(wallet);
      setXmtpClient(xmtpClient);
    }
  }

  const connectToFileOwner = async () => {
    if (xmtpClient == null) {
      alert("Please Create XMTP Client");
      return;
    }
    if (fileOwnerAddress == "") {
      alert("Please enter file owner wallet address");
      return;
    } 
    console.log("connecting with file owner");
    const conversation = await xmtpClient.conversations.newConversation(fileOwnerAddress);
    setConversation(conversation);
  };

  const requestAccess = async () => {
    if (conversation != null) {
      console.log("requesting file access");
      await conversation.send("#Ghostshare:request-accesss:file-cid:" + fileCID);
    }
  };

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
      <h2>Request file access</h2>
      <div>
        <h3>
          File Owner Wallet: {fileOwnerAddress}
        </h3>
        <label style={{ paddingRight: "10px" }}>File Owner Walet Address</label>
        <input
          value={fileOwnerAddress}
          placeholder="address you want to chat with"
          style={{ width: "500px" }}
          onChange={handleFileOwnerAddress}
        />
        <br />
        <br />
        <button name="connectToFileOwner" onClick={connectToFileOwner}>
          Connect
        </button>
        <br/>
        <br/>
        <button name="requestAccess" onClick={requestAccess}>
          RequestAccess
        </button>
      </div>
      <br/>
      <br/>
    </div>
  );
}
