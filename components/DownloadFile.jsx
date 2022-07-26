import React, { useEffect, useState } from "react";
import { Integration } from "web3.storage-lit-sdk";
import { ethers } from "ethers";
import { saveAs } from "file-saver";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";

import keyToEmojis from "../src/utils/keyToEmojis";
import contracts from "../metadata/deployed_contracts.json";
import ABI from "../metadata/contracts_ABI.json";
import { signAndSaveAuthMessage } from "../src/utils/signer";

import { Client } from "@xmtp/xmtp-js";
import { getXmtpEnv } from "../src/utils/xmtp/xmtp-env";
import * as GSXmtpMsgProtocol from "../src/utils/xmtp/xmtp-msg-protocol";

const styles = {
  card: {
    minHeight: "200px",
    zIndex: "10",
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    borderRadius: "30px",
    flexDirection: "column",
    padding: "0px",
  },
  cardContent: {
    padding: "0px",
    paddingTop: "24px",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
};

const DownloadFile = ({ cid, address, setIsRequestStarted }) => {
  const [isFileFound, setIsFileFound] = useState(true);
  const [isGranting, setIsGranting] = useState({ status: "false" }); // status: false, true, success, error
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isAccessToFileDenied, setIsAccessToFileDenied] = useState(false);

  const web3StorageLitIntegration = new Integration("mumbai");
  const [provider, SetProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [lookingForFile, setLookingForFile] = useState(true);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [stream, setStream] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [xmtpClient, setXmtpClient] = useState(null);

  // TODO DELETE AFTER TESTING
  // NOTE just for testing, changes the states based on drop down menu
  const updateState = (event) => {
    const status = event.target.value;
    if (status === "isFileFound=false") {
      setIsFileFound(false);
      setIsGranting({ status: "false" });
      setIsDownloading(false);
      setIsRequestStarted(false);
    } else if (status === "isGranting=false") {
      setIsFileFound(true);
      setIsGranting({ status: "false" });
      setIsRequestStarted(false);
    } else if (status === "isGranting=true") {
      setIsFileFound(true);
      setIsGranting({ status: "true" });
      setIsRequestStarted(true);
    } else if (status === "isGranting=success") {
      setIsFileFound(true);
      setIsGranting({ status: "success" });
      setIsDownloading(false);
      setIsRequestStarted(true);
      requestAccess();
    } else if (status === "isDownloading=true") {
      setIsFileFound(true);
      setIsGranting({ status: "success" });
      setIsDownloading(true);
      setIsRequestStarted(true);
    }
  };

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
    const initXmtpClient = async () => {
      if (!wallet) {
        console.error("no wallet available");
        return;
      }
      console.log("XMTP env: ", getXmtpEnv());
      setXmtpClient(await Client.create(wallet, { env: getXmtpEnv() }));
    };
    if (xmtpClient == null) {
      initXmtpClient();
    }
    if (typeof window !== "undefined") {
      // Perform localStorage action
      setRecipientAddress(localStorage.getItem("publicKey"));
    }
  }, []);

  useEffect(() => {
    if (cid && address) {
      setTimeout(() => {
        retrieveFileMetadata();
      }, 4000);
    }
  }, [cid, address]);

  useEffect(() => {
    console.log({ fileMetadata });
    if (fileMetadata?.fileCid) {
      console.log({ fileMetadata });
      setLookingForFile(false);
      setIsFileFound(true);
      hasAccess();
    }
  }, [fileMetadata]);

  const retrieveFileMetadata = async () => {
    try {
      const retrievedFileMetadata =
        await web3StorageLitIntegration.retrieveFileMetadata(cid);
      setFileMetadata(retrievedFileMetadata);
    } catch {
      console.log("retrieveFileMetadata false");
      setLookingForFile(false);
      setIsFileFound(false);
    }
  };

  const requestAccess = async () => {
    console.log("request access");
    setIsGranting({ status: "true" });
    setIsRequestStarted(true);
    await lookForUserAccess();
  };

  const lookForUserAccess = async () => {
    if (isGranting.status !== "success") {
      console.log("looking for access... connecting to file owner");
      await connectToFileOwner();
    } else {
      console.log("isGranting.status == success");
    }
  };

  const connectToFileOwner = async () => {
    if (xmtpClient == null) {
      console.error("Please Create XMTP Client");
      return;
    }
    if (address == "") {
      consolel.error("Please enter file owner wallet address");
      return;
    }
    if (conversation == null) {
      console.log("Creating conversation");
      setConversation(await xmtpClient.conversations.newConversation(address));
    }
  };

  useEffect(() => {
    if (conversation == null) return;
    sendRequestMessage();
  }, [conversation]);

  const sendRequestMessage = async () => {
    console.log("sending Hi!");
    await conversation.send("#Ghostshare:hi!");
    setTimeout(() => {
      console.log("sending Hi!");
    }, 2000);
    console.log("sending Hi again!");
    await conversation.send("#Ghostshare:hi!");
    setTimeout(() => {
      console.log("Sending FileAccessRequestMessage");
    }, 2000);
    const reqMsg = GSXmtpMsgProtocol.buildFileAccessRequestMessage(
      fileMetadata.fileCid,
      wallet.address
    );
    console.log("requesting file access:", reqMsg);
    await conversation.send(reqMsg);
    await waitForFileAccessRequestResponse();
    if (conversation == null) {
      console.log("Conversation is null");
    }
  };

  const waitForFileAccessRequestResponse = async () => {
    if (xmtpClient == null) {
      console.warn("Please wait for XMTP Client creation");
      return;
    }
    console.log("waitForFileAccessRequestResponse");
    setStream(await xmtpClient.conversations.stream());
  };

  useEffect(() => {
    if (stream == null) return;
    processStream();
  }, [stream]);

  const processStream = async () => {
    console.log("processing stream");
    for await (const newConvo of stream) {
      setConversation(newConvo);
      console.log(`New conversation started with ${newConvo.peerAddress}`);
      break;
    }
  };

  useEffect(() => {
    if (conversation == null) return;
    listenToConversation();
  }, [conversation]);

  const listenToConversation = async () => {
    for await (const message of await conversation.streamMessages()) {
      if (message.senderAddress === xmtpClient.address) {
        // This message was sent from me
        continue;
      }
      console.log(
        `New message from ${message.senderAddress}: ${message.content}`
      );
      if (GSXmtpMsgProtocol.isFileAccessGrantedMessage(message)) {
        console.log("Received a FileAccessGrantedMessage from file owner");
        const payloadData =
          GSXmtpMsgProtocol.extractFileAccessGrantedData(message);
        console.log("requestedFileCID:", payloadData.requestedFileCid);
        console.log("fileMetadata.fileCid:", fileMetadata.fileCid);
        // console.log("payloadData.requesterAddress:", payloadData.requesterAddress);
        // console.log("address:", address);
        if (
          payloadData.requestedFileCid.toLowerCase() ==
          fileMetadata.fileCid.toLowerCase()
        ) {
          // if (payloadData.requesterAddress.toLowerCase() == address.toLowerCase()) {
          console.log("Access to file granted");
          setInterval(async () => {
            await hasAccess();
          }, 4000);
          // } else {
          // console.log("requesterAddress and address dont' match");
          // }
        } else {
          console.log("requestedFileCid and cid dont' match");
        }
        // break;
      } else if (GSXmtpMsgProtocol.isFileAccessDeniedMessage(message)) {
        console.log("Received a FileAccessDeniedMessage from file owner");
        const payloadData =
          GSXmtpMsgProtocol.extractFileAccessDeniedData(message);
        console.log("requestedFileCID:", payloadData.requestedFileCid);
        console.log("fileMetadata.fileCid:", fileMetadata.fileCid);
        console.log(
          "payloadData.requesterAddress:",
          payloadData.requesterAddress
        );
        console.log("address:", address);
        if (
          payloadData.requestedFileCid.toLowerCase() ==
          fileMetadata.fileCid.toLowerCase()
        ) {
          // if (payloadData.requesterAddress.toLowerCase() == address.toLowerCase()) {
          console.log("Access to file denied");
          setIsAccessToFileDenied(true);
          setIsGranting({ status: "success" });
          // } else {
          // console.log("requesterAddress and address dont' match");
          // }
        } else {
          console.log("requestedFileCid and cid dont' match");
        }
      }
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

  const hasAccess = async () => {
    const fileRegistryContract = new ethers.Contract(
      contracts.FileRegistry,
      ABI.FileRegistry,
      provider
    );

    const hashedFileId = await hash(fileMetadata.fileCid);
    console.log("hashedFileId: ", hashedFileId);
    try {
      const _hasAccess = await fileRegistryContract.hasAccess(
        hashedFileId,
        localStorage.getItem("publicKey")
      );
      console.log({ _hasAccess });
      if (_hasAccess) {
        setIsGranting({ status: "success" });
      }
    } catch (err) {
      console.log(err?.message + err?.data?.message || err);
    } finally {
      console.log("Done with hasAccess");
    }
  };

  const handleFileDownload = async (event) => {
    event.preventDefault();
    // downloads starts -> spinner runs
    setDownloadSuccess(false);
    setIsDownloading(true);
    try {
      console.log("Downloading cid : ", cid);
      const file = await web3StorageLitIntegration.retrieveAndDecryptFile(cid);
      console.log({ file });
      saveAs(file, file.name);
    } catch (err) {
      console.log(err);
    } finally {
      setDownloadSuccess(true); // spinner stops
      setIsDownloading(false);
    }
  };

  // NOTE generated emojis are not greatly changing
  const encryptedEmojis = keyToEmojis(recipientAddress);
  // console.log({ encryptedEmojis });

  // Set the card content based on the stage in the share file procedure
  let cardContent;

  if (lookingForFile) {
    cardContent = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0px",
        }}
      >
        <Typography sx={styles.cardTitle}>Looking for file...</Typography>
        <CircularProgress size={100} sx={{ marginTop: "20px" }} />
      </Box>
    );
  } else if (!isFileFound) {
    cardContent = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0px",
        }}
      >
        <Typography sx={styles.cardTitle} color="error">
          File not found
        </Typography>
        <HighlightOffIcon sx={{ fontSize: "60px" }} color="error" />
        <Typography sx={{ fontWeight: "bold" }}>
          Please check if the link is correct.{" "}
        </Typography>
        <Typography
          sx={{ fontSize: "0.8rem", marginTop: "5px", display: "flex" }}
        >{`File with id of: ${cid}, not found.`}</Typography>
      </Box>
    );
  } else if (isGranting.status === "false" || isGranting.status === "true") {
    cardContent = (
      <>
        <Box
          sx={{
            height: { xs: "200px", md: "220px" },
            paddingTop: { xs: "0px", md: "20px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Typography sx={styles.cardTitle}>File to access</Typography>
          <FileOpenIcon
            sx={{ fontSize: "70px", marginTop: "15px", marginBottom: "15px" }}
          />
          <Typography sx={{ fontWeight: "bold" }}>
            {fileMetadata?.fileName}
          </Typography>
          {false && (
            <Typography sx={{ fontSize: "0.8rem" }}>{`Size: ...`}</Typography>
          )}
        </Box>
        <Box
          sx={{
            borderTop: "1px solid #E4E4E4",
            display: "flex",
            justifyContent: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {isGranting.status == "false" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Button variant="contained" onClick={requestAccess}>
                Request Access
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
                Share emoji combination{" "}
                <Tooltip title="The owner of this file should have the same emojis on his screen, in order to make sure that the request is comming from you.">
                  <PrivacyTipIcon fontSize="small" color="primary" />
                </Tooltip>
                <br />
                with the file owner:
              </Typography>
              <Box sx={{ display: "flex", marginTop: "20px" }}>
                <Box
                  sx={{
                    letterSpacing: "15px",
                    fontSize: "1.5rem",
                    borderRadius: "30px",
                    border: "1px solid #e4e4e4",
                    padding: "6px 12px",
                    paddingRight: "0px",
                    marginRight: "10px",
                  }}
                >
                  {encryptedEmojis.slice(0, 8)}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <CircularProgress size={25} />
                <Typography sx={{ paddingLeft: "15px", fontSize: "0.8rem" }}>
                  Waiting for file owner to grant access...
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </>
    );
  } else if (
    isGranting.status === "success" &&
    isDownloading == false &&
    !downloadSuccess &&
    !isAccessToFileDenied
  ) {
    cardContent = (
      <>
        <Box
          sx={{
            height: { xs: "200px", md: "220px" },
            paddingTop: { xs: "0px", md: "20px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Typography sx={styles.cardTitle}>Ready to go</Typography>
          <CloudDownloadIcon
            sx={{ fontSize: "70px", marginTop: "15px", marginBottom: "15px" }}
          />
          <Typography sx={{ fontWeight: "bold" }}>
            {fileMetadata?.fileName}
          </Typography>
          {false && (
            <Typography sx={{ fontSize: "0.8rem" }}>{`Size: ...`}</Typography>
          )}
        </Box>
        <Box
          sx={{
            borderTop: "1px solid #E4E4E4",
            display: "flex",
            justifyContent: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleFileDownload}
              color="secondary"
            >
              Download
            </Button>
          </Box>
        </Box>
      </>
    );
  } else if (isGranting.status === "success" && isDownloading == true) {
    cardContent = (
      <>
        <Box
          sx={{
            height: { xs: "200px", md: "220px" },
            paddingTop: { xs: "0px", md: "20px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Typography sx={styles.cardTitle}>Download started!</Typography>
          <CircularProgress
            size={100}
            sx={{ marginTop: "25px", marginBottom: "25px" }}
          />
          <Typography>See you next time 🙋‍♀️️️</Typography>
        </Box>
      </>
    );
  } else if (isGranting.status === "success" && isAccessToFileDenied == true) {
    cardContent = (
      <>
        <Box
          sx={{
            height: { xs: "200px", md: "220px" },
            paddingTop: { xs: "0px", md: "20px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Typography sx={styles.cardTitle}>Access to file Denied</Typography>
          <CircularProgress
            size={100}
            sx={{ marginTop: "25px", marginBottom: "25px" }}
          />
          <Typography>See you next time 🙋‍♀️️️</Typography>
        </Box>
      </>
    );
  } else if (downloadSuccess) {
    cardContent = (
      <>
        <Box
          sx={{
            height: { xs: "200px", md: "220px" },
            paddingTop: { xs: "0px", md: "20px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Typography sx={styles.cardTitle}>Download Successfully!</Typography>
          <DownloadDoneIcon
            sx={{ fontSize: "70px", marginTop: "15px", marginBottom: "15px" }}
          />
          <Typography sx={{ fontWeight: "bold" }}>
            See you next time 🙋‍♀️
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      {/** TODO DELETE AFTER TESTING */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 100000,
        }}
      >
        <select name="cars" id="cars" onChange={updateState}>
          <option value="isFileFound=false">Status: File not found</option>
          <option value="isGranting=false">Status: Request access</option>
          <option value="isGranting=true">Status: Waiting to be granted</option>
          <option value="isGranting=success">
            Status: Granted, can Download
          </option>
          <option value="isDownloading=true">Status: Downloading</option>
        </select>
      </div>
      {/** TODO DELETE AFTER TESTING */}
      <Card sx={styles.card} elevation={3}>
        <CardContent sx={styles.cardContent}>{cardContent}</CardContent>
      </Card>
    </>
  );
};

export default DownloadFile;
