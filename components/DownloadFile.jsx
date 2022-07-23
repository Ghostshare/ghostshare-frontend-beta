import React, { useState } from "react";
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

const DownloadFile = ({ fileId, setIsRequestStarted }) => {
  const [isFileFound, setIsFileFound] = useState(false);
  const [isGranting, setIsGranting] = useState({ status: "false" }); // status: false, true, success, error
  const [isDownloading, setIsDownloading] = useState(false);

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
    } else if (status === "isDownloading=true") {
      setIsFileFound(true);
      setIsGranting({ status: "success" });
      setIsDownloading(true);
      setIsRequestStarted(true);
    }
  };

  const requestAccess = () => {
    console.log("request access");
    setIsGranting({ status: "true" });
    setIsRequestStarted(true);
  };

  const startDownload = () => {
    console.log("start Download");
    setIsDownloading(true);
  };

  // TODO set file name and size dynamically
  const fileName = "MySecretFile.zip";
  const fileSize = "423 MB";

  // NOTE generated emojis are not greatly changing
  const recipientAddress = "0xDE3Af4d2fa609b6E66B9e39B12a649E296f044E7"; // TODO set dynamically
  const encryptedEmojis = keyToEmojis(recipientAddress);
  // console.log({ encryptedEmojis });

  // Set the card content based on the stage in the share file procedure
  let cardContent;
  if (!isFileFound) {
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
        >{`File with id of: ${fileId}, not found.`}</Typography>
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
          <Typography sx={{ fontWeight: "bold" }}>{fileName}</Typography>
          <Typography
            sx={{ fontSize: "0.8rem" }}
          >{`Size: ${fileSize}`}</Typography>
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
  } else if (isGranting.status === "success" && isDownloading == false) {
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
          <Typography sx={{ fontWeight: "bold" }}>{fileName}</Typography>
          <Typography
            sx={{ fontSize: "0.8rem" }}
          >{`Size: ${fileSize}`}</Typography>
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
              onClick={startDownload}
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
          <DownloadDoneIcon
            sx={{ fontSize: "70px", marginTop: "15px", marginBottom: "15px" }}
          />
          <Typography sx={{ fontWeight: "bold" }}>
            Visit your download folder.
          </Typography>
          <Typography>See you next time 🙋‍♀️️️</Typography>
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
