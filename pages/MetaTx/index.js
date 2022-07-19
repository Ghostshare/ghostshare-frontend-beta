import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Wallet from "../../components/Wallet";
import contracts from "../../metadata/deployed_contracts.json";
import { FileRegistry } from "../../metadata/contracts_ABI.json";
import { sendMetaTx } from "./fileregistry";
import EventListener from "./EventLog";

export default function MetaTx() {
  const [fileId, setFileId] = useState(
    "0x9c1e500a0e7502529e0b46816631158cd26142c7bc1468ef96f8781ce631a9ac"
  ); // hardcode a random fileId
  const [recipient, setRecipient] = useState("");
  const [wallet, setWallet] = useState();
  const [provider, SetProvider] = useState(null);
  const [recipientHasAccess, SetRecipientHasAccess] = useState(null);

  useEffect(() => {
    SetProvider(
      new ethers.providers.InfuraProvider(
        "maticmum", // Mumbai Testnet
        process.env.NEXT_PUBLIC_INFURA_API_KEY
      )
    );
  }, []);

  const handleFileId = (e) => {
    setFileId(e.target.value);
  };

  const handleRecipient = (e) => {
    setRecipient(e.target.value);
  };

  // Direct, without forwarding contract inbetween
  const hasAccess = async (event) => {
    event.preventDefault();
    SetRecipientHasAccess(null);

    const fileRegistryContract = new ethers.Contract(
      contracts.FileRegistry,
      FileRegistry,
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

  useEffect(() => {
    console.log({ wallet });
  }, [wallet]);

  const sendTx = async (event) => {
    event.preventDefault();
    // setSubmitting(true);

    const fileRegistryContract = new ethers.Contract(
      contracts.FileRegistry,
      FileRegistry,
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
    </div>
  );
}
