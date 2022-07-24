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

const DownloadFile = ({ cid, setIsRequestStarted }) => {
  const [isFileFound, setIsFileFound] = useState(false);
  const [isGranting, setIsGranting] = useState({ status: "false" }); // status: false, true, success, error
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const web3StorageLitIntegration = new Integration("mumbai");
  const [provider, SetProvider] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [lookingForFile, setLookingForFile] = useState(true);
  const [recipientAddress, setRecipientAddress] = useState("");

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
    signAndSaveAuthMessage(wallet, window);

    if (typeof window !== "undefined") {
      // Perform localStorage action
      setRecipientAddress(localStorage.getItem("publicKey"));
    }
  }, []);

  useEffect(() => {
    if (cid) {
      setTimeout(() => {
        retrieveFileMetadata();
        setLookingForFile(false);
      }, 4000);
    }
  }, [cid]);

  useEffect(() => {
    if (fileMetadata?.fileCid) {
      setIsFileFound(true);
    } else {
      setIsFileFound(false);
    }
  }, [fileMetadata]);

  const retrieveFileMetadata = async () => {
    const retrievedFileMetadata =
      await web3StorageLitIntegration.retrieveFileMetadata(cid);
    setFileMetadata(retrievedFileMetadata);
  };

  const requestAccess = () => {
    console.log("request access");
    setIsGranting({ status: "true" });
    setIsRequestStarted(true);
    // lookForUserAccess();
  };

  const lookForUserAccess = () => {
    while (isGranting.status !== "success") {
      setTimeout(() => {
        console.log("looking for access...");
      }, 5000);
    }
  };

  const refetchTimeoutInSeconds = 5;
  const [now, setNow] = useState(new Date());
  const [lastRefetch, setLastRefetch] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(refreshDate, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  const refreshDate = () => {
    setNow(new Date());
  };

  const refetch = () => {
    refetchHasAccess();
    setLastRefetch(new Date());
  };

  const refetchHasAccess = () => {
    console.log("look if user has access...");
    hasAccess();
  };

  const isRefetchTimeout =
    Math.floor(now - lastRefetch) / 1000 > refetchTimeoutInSeconds
      ? true
      : false;

  useEffect(() => {
    if (isGranting.status !== "success" && isRefetchTimeout) {
      refetch();
    }
  }, [isRefetchTimeout]);

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
      setDownloadSuccess(true); // spinner stops
      setIsDownloading(false);
    } catch (err) {
      console.log(err);
      setDownloadSuccess(true); // spinner stops
      setIsDownloading(false);
    }
  };

  const startDownload = () => {
    console.log("start Download");
    setIsDownloading(true);
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
    !downloadSuccess
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
