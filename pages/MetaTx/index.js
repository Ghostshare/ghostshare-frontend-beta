import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contracts from "../../metadata/deployed_contracts.json";
import ABI from "../../metadata/contracts_ABI.json";
import { sendMetaTx } from "../../components/MetaTx/fileregistry";
import EventListener from "../../components/MetaTx/EventLog";
// Web3.Storage-Lit-SDK Integration imports
import { Integration } from "web3.storage-lit-sdk";
import { saveAs } from "file-saver";
import { signAndSaveAuthMessage } from "../../src/utils/signer";

export default function MetaTx() {
  const [fileId, setFileId] = useState(
    "bafybeidwlo6uvtph7weehkzi3p4fl4ll2rss3vdkyllqypuzioamg4kp7i"
  ); // hardcode a random fileId
  const [recipient, setRecipient] = useState("");
  const [wallet, setWallet] = useState();
  const [provider, SetProvider] = useState(null);
  const [recipientHasAccess, SetRecipientHasAccess] = useState(null);
  const [file, setFile] = useState();
  const [cid, setCid] = useState(null);

  const web3StorageLitIntegration = new Integration("mumbai");

  useEffect(() => {
    SetProvider(
      new ethers.providers.InfuraProvider(
        "maticmum", // Mumbai Testnet
        process.env.NEXT_PUBLIC_INFURA_API_KEY
      )
    );
    const privateKey = localStorage.getItem("privateKey");
    console.log(privateKey, privateKey.length);
    web3StorageLitIntegration.startLitClient(window);
    const wallet = new ethers.Wallet(privateKey, provider);
    setWallet(wallet);
    signAndSaveAuthMessage(wallet, window);
  }, []);

  const handleFileId = (e) => {
    setFileId(e.target.value);
  };

  const handleRecipient = (e) => {
    setRecipient(e.target.value);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    // Uploads starts --> spinner runs
    setCid(null);
    try {
      // CID belongs to the IPFS Metadata
      const cid = await web3StorageLitIntegration.uploadFile(file);
      console.log({ cid });
      setCid(cid);
      // sendTx("registerFile")
      // setUploadIsDone(true)
      // spinner stops
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileDownload = async (event) => {
    event.preventDefault();
    // downloads starts -> spinner runs
    try {
      console.log("Downloading cid : ", cid);
      // MISSING: retrieve meta data to render
      const file = await web3StorageLitIntegration.retrieveAndDecryptFile(cid);
      console.log({ file });
      saveAs(file, file.name);
      // setDownloadIsDone(true)
      // spinner stops
    } catch (err) {
      console.log(err);
    }
  };

  // Direct, without forwarding contract inbetween
  const hasAccess = async (event) => {
    event.preventDefault();
    SetRecipientHasAccess(null);

    const fileRegistryContract = new ethers.Contract(
      contracts.FileRegistry,
      ABI.FileRegistry,
      provider
    );
    const hashedFileId = await hash(fileId);
    console.log("hashedFileId: ", hashedFileId);
    try {
      const _hasAccess = await fileRegistryContract.hasAccess(
        hashedFileId,
        recipient
      );
      console.log({ _hasAccess });
      SetRecipientHasAccess(_hasAccess);
    } catch (err) {
      console.log(err?.message + err?.data?.message || err);
    } finally {
      console.log("Done with hasAccess");
    }
  };

  const hash = async (data) => {
    const utf8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, "0"))
      .join("");
    return "0x" + hashHex;
  };

  const sendTx = async (event) => {
    event.preventDefault();
    // setSubmitting(true);

    const fileRegistryContract = new ethers.Contract(
      contracts.FileRegistry,
      ABI.FileRegistry,
      provider
    );
    console.log({ event });

    let method;
    let value;
    const hashedFileId = await hash(fileId);
    console.log("hashedFileId: ", hashedFileId);
    if (event.target.name === "registerFile") {
      method = "registerFile";
      value = [hashedFileId];
    } else if (event.target.name === "grantAccess") {
      method = "grantAccess";
      value = [hashedFileId, recipient];
    }
    console.log({ method, value });
    console.log({ fileRegistryContract });

    const privateKey = localStorage.getItem("privateKey");
    const _wallet = new ethers.Wallet(privateKey, provider);

    try {
      const response = await sendMetaTx(
        fileRegistryContract,
        _wallet,
        method,
        value
      );
      console.log({ response });
      /* TODO try to get tx hash as response from OZ Autotask and wait for tx
      const hash = response?.hash;
      const onClick = hash
        ? () => window.open(`https://mumbai.polygonscan.com/tx/${hash}`)
        : undefined;
      toast("Transaction sent!", {
        type: "info",
        closeOnClick: false,
        onClick,
      });
      */
    } catch (err) {
      console.log(err?.message + err?.data?.message || err);
    } finally {
      // setSubmitting(false);
      console.log("Done with sendTx");
    }
  };

  return (
    <div style={{ padding: "50px 100px" }}>
      <h2> Meta Transactions for FileRegistry.sol</h2>
      <p>
        FileRegistry deployed at:{" "}
        <a
          href={`https://mumbai.polygonscan.com/address/${contracts.FileRegistry}`}
        >
          {contracts.FileRegistry}
        </a>
      </p>
      <p>
        Forwarding Contract deployed at:{" "}
        <a
          href={`https://mumbai.polygonscan.com/address/${contracts.MinimalForwarder}`}
        >
          {contracts.MinimalForwarder}
        </a>
      </p>
      <p>Wallet: {wallet?.address}</p>
      <h2>State Changing Functions (Gasless / MetaTx)</h2>
      <div>
        <h4>
          function registerFile(bytes32 fileId) public returns (bool
          fileRegistered)
        </h4>
        <label style={{ paddingRight: "10px" }}>fileId</label>
        <input
          value={fileId}
          placeholder="bytes32 fileId"
          style={{ width: "500px" }}
          onChange={handleFileId}
        />
        <br />
        <button name="registerFile" onClick={sendTx}>
          Register File
        </button>
      </div>
      <div>
        <h4>function grantAccess(bytes32 fileId, address recipient)</h4>
        <label style={{ paddingRight: "10px" }}>fileId</label>
        <input
          value={fileId}
          onChange={handleFileId}
          placeholder="bytes32 fileId"
          style={{ width: "500px" }}
        />
        <br />
        <label style={{ paddingRight: "10px" }}>recipient</label>
        <input
          value={recipient}
          onChange={handleRecipient}
          placeholder="address recipient"
          style={{ width: "500px" }}
        />
        <br />
        <button name="grantAccess" onClick={sendTx}>
          Grant Access
        </button>
      </div>
      <h2>View Function </h2>
      <div>
        <h4>function hasAccess(bytes32 fileId, address recipient)</h4>
        <label style={{ paddingRight: "10px" }}>fileId</label>
        <input
          value={fileId}
          onChange={handleFileId}
          placeholder="bytes32 fileId"
          style={{ width: "500px" }}
        />
        <br />
        <label style={{ paddingRight: "10px" }}>recipient</label>
        <input
          value={recipient}
          onChange={handleRecipient}
          placeholder="address recipient"
          style={{ width: "500px" }}
        />
        <br />
        <button onClick={hasAccess}>Has Access</button>
        <p>{`Recipient has access: ${recipientHasAccess}`}</p>
      </div>
      {provider && <EventListener provider={provider} />}
      <h2>File Sharing Functions (Web3StorageLitIntegration) </h2>
      <div>
        <h4>function uploadFile(file)</h4>
        <label style={{ paddingRight: "10px" }}>File</label>
        <input
          type="file"
          onChange={handleFile}
          placeholder="File to upload"
          style={{ width: "500px" }}
        />
        <br />
        <button onClick={handleFileUpload}>Upload File</button>
        <p>
          Metadata IPFS link:{" "}
          <a href={`https://${cid}.ipfs.dweb.link`} target="_blank">
            {cid}
          </a>
        </p>
      </div>
      <div>
        <h4>retrieveAndDecryptFile(cid)</h4>
        <p>{`CID: ${cid}`}</p>
        <button onClick={handleFileDownload}>Download File</button>
      </div>
    </div>
  );
}
