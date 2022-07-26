import React, { useState, useEffect } from "react";
import { Integration } from "web3.storage-lit-sdk";
import { ethers } from "ethers";
import copy from "copy-to-clipboard";
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Input,
  Button,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoIcon from "@mui/icons-material/Info";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import contracts from "../metadata/deployed_contracts.json";
import ABI from "../metadata/contracts_ABI.json";
import { signAndSaveAuthMessage } from "../src/utils/signer";
import { sendMetaTx } from "../components/MetaTx/fileregistry";

import DragAndDrop from "./DragAndDrop";
import keyToEmojis from "../src/utils/keyToEmojis";

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
  shareLinkTextfield: {
    backgroundColor: "#E4E4E4",
    marginTop: "20px",
    paddingLeft: "5px",
    borderRadius: "3px",
    fontSize: "0.8rem",
    width: "100%",
    maxWidth: "500px",
  },
  shareLinkButton: {
    color: "black",
    marginTop: "5px",
    width: "100%",
    maxWidth: "500px",
  },
};

const ShareFile = ({ isUploadStarted, setIsUploadStarted }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [isUploading, setIsUploading] = useState({ status: "false" }); // status: false, true, success, error
  const [isGranting, setIsGranting] = useState({ status: "false" }); // status: false, true, success, error
  const [CID, setCID] = useState(null);
  const [provider, SetProvider] = useState(null);
  // XMTP related
  const [xmtpClient, setXmtpClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [sharedFileCID, setSharedFileCID] = useState("");
  const [stream, setStream] = useState(null);
  const [fileRequestInfo, setFileRequestInfo] = useState(null);
  const [wallet, setWallet] = useState(null);

  const web3StorageLitIntegration = new Integration("mumbai");

  useEffect(() => {
    SetProvider(
      new ethers.providers.InfuraProvider(
        "maticmum", // Mumbai Testnet
        process.env.NEXT_PUBLIC_INFURA_API_KEY
      )
    );
    const privateKey = localStorage.getItem("privateKey");
    web3StorageLitIntegration.startLitClient(window);
    const newWallet = new ethers.Wallet(privateKey, provider);
    setWallet(newWallet);
    signAndSaveAuthMessage(newWallet, window);
    const initXmtpClient = async () => {
      if (!newWallet) {
        console.error("no wallet available");
        return;
      }
      console.log("XMTP env: ", getXmtpEnv());
      setXmtpClient(await Client.create(newWallet, { env: getXmtpEnv() }));
    };
    if (xmtpClient == null) {
      initXmtpClient();
    }
  }, []);

  // Start - XMTP logic

  useEffect(() => {
    if (sharedFileCID == "") return;
    waitForFileAccessRequest();
  }, [sharedFileCID]);

  const waitForFileAccessRequest = async () => {
    if (xmtpClient == null) {
      console.warn("Please wait for XMTP Client creation");
      return;
    }
    console.log("waitForFileAccessRequest");
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
      if (GSXmtpMsgProtocol.isFileAccessRequestMessage(message)) {
        const payloadData =
          GSXmtpMsgProtocol.extractFileAccessRequestData(message);
        console.log("requestrequestedFileCid:", payloadData.requestedFileCid);
        console.log("sharedFileCID:", sharedFileCID);
        if (
          payloadData.requestedFileCid.toLowerCase() ==
          sharedFileCID.toLowerCase()
        ) {
          console.log("setting setFileRequestInfo");
          setFileRequestInfo({
            requestedFileCid: payloadData.requestedFileCid,
            requesterAddress: payloadData.requesterAddress,
          });
        } else {
          console.log("requestrequestedFileCid and sharedFileCID dont' match");
        }
        // break;
      }
    }
  };

  useEffect(() => {
    if (fileRequestInfo == null) return;
    console.log("fileRequestInfo: ", fileRequestInfo);
    setIsGranting({ status: "true" });
    setIsGrantingRunning(false);
  }, [fileRequestInfo]);

  const sendAccessGrantedMsg = async () => {
    if (conversation == null) {
      console.warn("Please wait for conversation to be setup");
      return;
    }
    const grantMsg = GSXmtpMsgProtocol.buildFileAccessGrantedMessage(
      fileRequestInfo.requestedFileCid,
      fileRequestInfo.requesterAddress
    );
    console.log("grant access msg:", grantMsg);
    conversation.send(grantMsg);
  };

  const sendAccessDeniedMsg = async () => {
    if (conversation == null) {
      console.warn("Please wait for conversation to be setup");
      return;
    }
    const denyMsg = GSXmtpMsgProtocol.buildFileAccessDeniedMessage(
      fileRequestInfo.requestedFileCid,
      fileRequestInfo.requesterAddress
    );
    console.log("deny access msg:", denyMsg);
    conversation.send(denyMsg);
  };

  // End - XMTP logic

  // TODO DELETE AFTER TESTING
  // NOTE just for testing, changes the states based on drop down menu
  const showTestingDropdown = true;
  const updateState = (event) => {
    const status = event.target.value;
    if (status === "selectedFile=false") {
      console.log(1);
      setSelectedFile("");
      setIsUploadStarted(false);
    } else if (status === "selectedFile=true") {
      console.log(2);
      setSelectedFile("somefile.zip");
      setIsUploading({ status: "false" });
      setIsUploadStarted(false);
    } else if (status === "isUploading=true") {
      setSelectedFile("somefile.zip");
      setIsUploading({ status: "true" });
      setIsUploadStarted(true);
    } else if (status === "isUploading=success") {
      setSelectedFile("somefile.zip");
      setIsUploading({ status: "success" });
      setIsGranting({ status: "false" });
      setIsUploadStarted(true);
    } else if (status === "isGranting=true") {
      setSelectedFile("somefile.zip");
      setIsUploading({ status: "success" });
      setIsGranting({ status: "true" });
      setIsUploadStarted(true);
    } else if (status === "isGranting=success") {
      setSelectedFile("somefile.zip");
      setIsUploading({ status: "success" });
      setIsGranting({ status: "success" });
      setIsUploadStarted(true);
    }
  };

  const handleDeleteSelectedFile = () => {
    setSelectedFile();
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    // Uploads starts --> spinner runs
    setIsUploading({ status: "true" });
    setIsUploadStarted(true);
    setCID(null);
    try {
      // CID belongs to the IPFS Metadata
      const { metadataCid, fileCid } =
        await web3StorageLitIntegration.uploadFile(selectedFile);
      console.log({ metadataCid });
      setCID(metadataCid);
      localStorage.setItem("lasFileCid", fileCid);
      // sendMetaTx("registerFile")
      sendTx("registerFile", fileCid);
      // setUploadIsDone(true) --> spinner stops
      setIsUploading({ status: "success" });
      setSharedFileCID(fileCid);
    } catch (err) {
      console.log(err);
      setIsUploadStarted(false);
      setIsUploading({ status: "error" });
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

  const sendTx = async (method, fileCid, address) => {
    console.log("### STARTED sendTx ###");
    console.log({ method });
    console.log({ fileCid });
    const fileRegistryContract = new ethers.Contract(
      contracts.FileRegistry,
      ABI.FileRegistry,
      provider
    );

    try {
      let value;
      const hashedFileId = await hash(fileCid);
      console.log("hashedFileId: ", hashedFileId);
      if (method === "registerFile") {
        value = [hashedFileId];
      } else if (method === "grantAccess") {
        value = [hashedFileId, address];
      }

      const privateKey = localStorage.getItem("privateKey");
      const _wallet = new ethers.Wallet(privateKey, provider);

      const response = await sendMetaTx(
        fileRegistryContract,
        _wallet,
        method,
        value
      );
      console.log({ response });
    } catch (err) {
      console.log(err?.message + err?.data?.message || err);
    } finally {
      console.log("### END sendMetaTx ###");
    }
  };

  const cancelUpload = () => {
    setSelectedFile();
    setIsUploading({ status: "false" });
    setIsUploadStarted(false);
  };

  // TODO add spinner to indicate processing of the tx, more to next state if success
  const [isGrantingRunning, setIsGrantingRunning] = useState(false); // NOTE quick & drity implementation
  const grantAccess = async () => {
    const fileCid = localStorage.getItem("lasFileCid");
    console.log("grant access");
    setIsGrantingRunning(true);
    await sendTx(
      "grantAccess",
      fileRequestInfo.requestedFileCid,
      fileRequestInfo.requesterAddress
    );
    await sendAccessGrantedMsg();
    setTimeout(() => {
      setIsGrantingRunning(false);
      setIsGranting({ status: "success" });
    }, 7000);
  };

  const declineAccess = async () => {
    console.log("decline access");
    await sendAccessDeniedMsg();
    setTimeout(() => {
      setIsGranting({ status: "false" });
    }, 3000);
  };

  const resetAllStates = () => {
    console.log("ready to upload another file");
    setSelectedFile();
    setIsUploading({ status: "false" });
    setIsGranting({ status: "false" });
    setIsUploadStarted(false);
  };

  // CID for private link dynamically
  const shareLink = () => {
    return `${window.location.protocol}//${window.location.host}/file/${CID}/${wallet?.address}`;
  };

  // NOTE generated emojis are not greatly changing
  const encryptedEmojis = () => {
    return keyToEmojis(fileRequestInfo.requesterAddress);
  };
  // console.log({ encryptedEmojis });

  // Set the card content based on the stage in the share file procedure
  let cardContent;
  if (!selectedFile) {
    // select a file
    cardContent = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0px",
        }}
      >
        <label htmlFor="btn-upload">
          <Input
            id="btn-upload"
            type="file"
            onChange={handleFileChange}
            sx={{ display: "none" }}
          />
          <Button className="btn-choose" component="span" variant="contained">
            Select File
          </Button>
        </label>
        <Typography pt={1}>Or drop a file inside the window.</Typography>
      </Box>
    );
  } else if (isUploading.status === "false") {
    // file is selected, click upload
    cardContent = (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography sx={styles.cardTitle}>Selected File</Typography>
        <Chip
          label={selectedFile?.name}
          variant="outlined"
          sx={{ marginTop: "20px", marginBottom: "20px", minWidth: "180px" }}
          onDelete={handleDeleteSelectedFile}
        />
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleFileUpload}
          endIcon={<FileUploadIcon />}
          sx={{ minWidth: "180px" }}
        >
          Upload File
        </Button>
      </Box>
    );
  } else if (isUploading.status === "true") {
    // is uploading...
    cardContent = (
      <>
        <Box
          sx={{
            height: "255px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={"100px"} />
          <Typography
            sx={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "10px" }}
          >
            Uploading in progress..
          </Typography>
        </Box>
        <Box
          sx={{
            borderTop: "1px solid #E4E4E4",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={cancelUpload}
            variant="outlined"
            sx={{ marginTop: "20px" }}
          >
            Cancel
          </Button>
        </Box>
      </>
    );
  } else if (
    // TODO add a fallback if isUploading.status === "error"
    // upload done, granting access
    isUploading.status === "success" &&
    (isGranting.status == "false" || isGranting.status == "true")
  ) {
    cardContent = (
      <>
        <Box
          sx={{
            height: "255px",
            paddingTop: { xs: "0px", md: "20px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            <CheckCircleOutlineIcon sx={{ marginRight: "10px" }} />
            <Typography sx={styles.cardTitle}>Almost done!</Typography>
          </Box>
          <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
            Your file has been successfully uploaded!
          </Typography>
          <Typography>
            Before someone can access it, you have to share the invite link and
            grant access shortly.
          </Typography>
          <Input sx={styles.shareLinkTextfield} value={shareLink()} />
          <Button
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={() => copy(shareLink())}
            value={shareLink()}
            sx={styles.shareLinkButton}
          >
            Copy link & share it!
          </Button>
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
              <CircularProgress />
              <Typography sx={{ paddingLeft: "15px" }}>
                Waiting for recipient{" "}
                <Tooltip title="Two-factor authentication: The recipient of your private link has to request access, which you need to grant, before a download is possible.">
                  <InfoIcon fontSize="small" color="primary" />
                </Tooltip>
                <br /> to access your file...
              </Typography>
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
                Compare emojis with recipient{" "}
                <Tooltip title="The recipient should have the same emojis on his screen. Please compare and only grant access to your file if the emojis match exactly!">
                  <PrivacyTipIcon fontSize="small" color="primary" />
                </Tooltip>
                <br />& grant or decline file access:
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
                  {encryptedEmojis()}
                </Box>
                {!isGrantingRunning ? (
                  <>
                    <Tooltip title="Grant Access">
                      <IconButton
                        size="large"
                        color="success"
                        variant="contained"
                        sx={{ marginRight: "5px" }}
                        onClick={grantAccess}
                      >
                        <ThumbUpOffAltIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Decline Access">
                      <IconButton
                        size="large"
                        color="error"
                        variant="contained"
                        onClick={declineAccess}
                      >
                        <ThumbDownOffAltIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <CircularProgress />
                )}
              </Box>
            </Box>
          )}
        </Box>
      </>
    );
  } else if (isGranting.status == "success") {
    // share file, done
    cardContent = (
      <>
        <Box
          sx={{
            height: "255px",
            paddingTop: { xs: "0px", md: "20px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            <DoneAllIcon sx={{ marginRight: "10px" }} />
            <Typography sx={styles.cardTitle}>
              Successfully shared! 🥳
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: "bold" }}>
            Your file has been successfully shared!
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            The recipient which you granted access to can now download this
            file.
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", marginTop: "20px", textAlign: "center" }}
          >
            You want to share this file again?
          </Typography>
          <Button
            size="small"
            variant="outlined"
            front
            startIcon={<AccountCircleIcon />}
            sx={{ fontSize: "0.9rem", marginTop: "5px" }}
            href="/account"
          >
            To your Dashboard
          </Button>
          <Typography
            sx={{ fontSize: "0.8rem", marginTop: "5px", display: "flex" }}
          >
            Or click on this{" "}
            <AccountCircleIcon
              fontSize="small"
              sx={{ marginLeft: "2px", marginRight: "2px" }}
            />{" "}
            icon in the top right of this page.
          </Typography>
        </Box>
        <Box
          sx={{
            borderTop: "1px solid #E4E4E4",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <Button
              size="small"
              startIcon={<AddCircleOutlineIcon />}
              sx={{ fontSize: "0.9rem", marginTop: "5px" }}
              onClick={resetAllStates}
            >
              upload another file
            </Button>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      {/** TODO DELETE AFTER TESTING */}
      {showTestingDropdown && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 100000,
          }}
        >
          <select name="cars" id="cars" onChange={updateState}>
            <option value="selectedFile=false">Status: No file Selected</option>
            <option value="selectedFile=true">
              Status: File Selected, click Upload
            </option>
            <option value="isUploading=true">Status: Is uploading</option>
            <option value="isUploading=success">
              Status: Upload successfull, waiting request
            </option>
            <option value="isGranting=true">Status: Granting</option>
            <option value="isGranting=success">
              Status: Done! Shared successfully
            </option>
          </select>
        </div>
      )}
      {/** TODO DELETE AFTER TESTING */}
      <Card sx={styles.card} elevation={3}>
        <CardContent sx={styles.cardContent}>{cardContent}</CardContent>
      </Card>
      {(isUploading.status == "false" || isUploading.status == "error") && (
        <DragAndDrop setSelectedFile={setSelectedFile} />
      )}
    </>
  );
};

export default ShareFile;
