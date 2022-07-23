import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Wallet from "../../components/Wallet";
import contracts from "../../metadata/deployed_contracts.json";
import ABI from "../../metadata/contracts_ABI.json";
import { sendMetaTx } from "../../components/MetaTx/fileregistry";
import EventListener from "../../components/MetaTx/EventLog";

// Web3.Storage-Lit-SDK Integration imports
import { Integration } from 'web3.storage-lit-sdk';
import { saveAs } from 'file-saver';
import { SiweMessage } from "lit-siwe";
import { getAddress } from '@ethersproject/address';
import { verifyMessage } from "@ethersproject/wallet";
import { toUtf8Bytes } from "@ethersproject/strings";
import naclUtil from "tweetnacl-util";
import nacl from "tweetnacl";

export default function MetaTx() {
  const [fileId, setFileId] = useState(
    "0x9c1e500a0e7502529e0b46816631158cd26142c7bc1468ef96f8781ce631a9ac"
  ); // hardcode a random fileId
  const [recipient, setRecipient] = useState("");
  const [wallet, setWallet] = useState();
  const [provider, SetProvider] = useState(null);
  const [recipientHasAccess, SetRecipientHasAccess] = useState(null);
  const [file, setFile] = useState();
  const [cid, setCid] = useState(null);

  const web3StorageLitIntegration = new Integration('mumbai');

  // const componentDidMount = () => {
  //   web3StorageLitIntegration.startLitClient(window);
  // };

  useEffect(() => {
    SetProvider(
      new ethers.providers.InfuraProvider(
        "maticmum", // Mumbai Testnet
        process.env.NEXT_PUBLIC_INFURA_API_KEY
      )
    );
    web3StorageLitIntegration.startLitClient(window);
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
    setCid(null);
    try {
      const cid = await web3StorageLitIntegration.uploadFile(file);
      console.log({ cid });
      setCid(cid);
    } catch (err) {
      console.log(err?.message + err?.data?.message || err);
    } finally {
      console.log("Done with upload file");
    }
  };

  const handleFileDownload = async (event) => {
    event.preventDefault();
    try {
      console.log("Downloading cid : ", cid );
      const file = await web3StorageLitIntegration.retrieveAndDecryptFile(cid);
      saveAs(file, file.name);
    } catch (err) {
      console.log(err?.message + err?.data?.message || err);
    } finally {
      console.log("Done with upload file");
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

    try {
      const _hasAccess = await fileRegistryContract.hasAccess(
        fileId,
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

  /**
   * Sign the auth message with the user's wallet, and store it in localStorage.  Called by checkAndSignAuthMessage if the user does not have a signature stored.
   * @param {Object} params
   * @param {Web3Provider} params.web3 An ethers.js Web3Provider instance
   * @param {string} params.account The account to sign the message with
   * @returns {AuthSig} The AuthSig created or retrieved
   */
  const signAndSaveAuthMessage = async () => {
    try {
      console.log("running signAndSaveAuthMessage");
      // TODO: pull chainId from context
      const chainId = "80001";
      const preparedMessage = {
        domain: window.location.host,
        address: getAddress(wallet.address), // convert to EIP-55 format or else SIWE complains
        uri: window.location.origin,
        version: "1",
        chainId,
      };
      // if (resources && resources.length > 0) {
      //   preparedMessage.resources = resources;
      // }
      console.log("wallet.address: ", wallet.address);
      console.log("getAddress(wallet.address): ", getAddress(wallet.address));
      const message = new SiweMessage(preparedMessage);
      console.log("SiweMessage", message);
      const body = message.prepareMessage();
      const signedResult = await signMessage({
        body,
        account: wallet.address,
      });
      localStorage.setItem(
        "lit-auth-signature",
        JSON.stringify({
          sig: signedResult.signature,
          derivedVia: "web3.eth.personal.sign",
          signedMessage: body,
          address: getAddress(signedResult.address),
        })
      );
      // store a keypair in localstorage for communication with sgx
      const commsKeyPair = nacl.box.keyPair();
      localStorage.setItem(
        "lit-comms-keypair",
        JSON.stringify({
          publicKey: naclUtil.encodeBase64(commsKeyPair.publicKey),
          secretKey: naclUtil.encodeBase64(commsKeyPair.secretKey),
        })
      );
      console.log("generated and saved lit-comms-keypair");
    } catch (err) {
      console.log(err?.message + err?.data?.message || err);
    } finally {
      console.log("checkLitSignature");
    }
  };

  /**
   * @typedef {Object} AuthSig
   * @property {string} sig - The actual hex-encoded signature
   * @property {string} derivedVia - The method used to derive the signature. Typically "web3.eth.personal.sign"
   * @property {string} signedMessage - The message that was signed
   * @property {string} address - The crypto wallet address that signed the message
   */
  const signMessage = async ({ body, account }) => {
    const messageBytes = toUtf8Bytes(body);
    const signature = await wallet.signMessage(messageBytes);
    const address = verifyMessage(body, signature);
    console.log("Signature: ", signature);
    console.log("address: ", account);
    console.log("recovered address: ", address);
    if (address !== account) {
      const msg = `ruh roh, the user signed with a different address (${address}) then they\'re using with web3 (${account}).  this will lead to confusion.`;
      console.error(msg);
      alert(
        "something seems to be wrong with your wallets message signing.  maybe restart your browser or your wallet.  your recovered sig address does not match your web3 account address"
      );
      throw new Error(msg);
    }
    return { signature, address };
  };

  useEffect(() => {
    console.log({ wallet });
    signAndSaveAuthMessage();
  }, [wallet]);

  const sendTx = async (event) => {
    event.preventDefault();
    // setSubmitting(true);

    const fileRegistryContract = new ethers.Contract(
      contracts.FileRegistry,
      ABI.FileRegistry,
      wallet?.provider
    );
    console.log({ event });

    let method;
    let value;
    if (event.target.name === "registerFile") {
      method = "registerFile";
      value = [fileId];
    } else if (event.target.name === "grantAccess") {
      method = "grantAccess";
      value = [fileId, recipient];
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
      <Wallet wallet={wallet} setWallet={setWallet} />
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
        <p>Metadata IPFS link: <a href={`https://${cid}.ipfs.dweb.link`} target="_blank">{cid}</a></p>
      </div>
      <div>
        <h4>retrieveAndDecryptFile(cid)</h4>
        <p>{`CID: ${cid}`}</p>
        <button onClick={handleFileDownload}>Download File</button>
      </div>
    </div>
  );
}
