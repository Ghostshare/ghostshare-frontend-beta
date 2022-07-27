import React from "react";
import Image from "next/image";
import { Typography, Container, Box, Paper } from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import PublicIcon from "@mui/icons-material/Public";
import contracts from "../metadata/deployed_contracts.json";

const styles = {
  Box: {
    minHeight: "100vh",
    padding: "4rem 0",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "sticky",
    top: 0,
    boxShadow: "0px -6px 10px 0px #00000052",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "50px",
  },
  benefitBox: {
    marginBottom: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  subtitleBox: { display: "flex" },
  subtitleIcon: { fontSize: "3rem", marginRight: "15px" },
  subtitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "25px",
    textAlign: "center",
  },
  missionBox: { display: "flex", flexDirection: "column" },
  missionText: { fontSize: "1.3rem", textAlign: "center", marginTop: "25px" },
  bold: { fontWeight: "bold" },
};

const WhatWhyHow = () => {
  return (
    <>
      <Box id="what" sx={styles.Box}>
        <Container maxWidth="sm">
          <Typography style={styles.title}>What you can expect.</Typography>
          <Box sx={styles.benefitBox}>
            <Box sx={styles.subtitleBox}>
              <AddTaskIcon sx={styles.subtitleIcon} />
              <Typography sx={styles.subtitle}>Hassle-free</Typography>
            </Box>
            <Typography>
              Even though it’s a Web3 Application, we hide everything what’s no
              needed away from you for the best sharing experience. No wallet,
              no gas!
            </Typography>
          </Box>
          <Box sx={styles.benefitBox}>
            <Box sx={styles.subtitleBox}>
              <EnhancedEncryptionIcon sx={styles.subtitleIcon} />
              <Typography sx={styles.subtitle}>100% Private</Typography>
            </Box>
            <Typography>
              By using our service, you don’t expose your email address or any
              other personal data. Every file share happens in secret.
            </Typography>
          </Box>
          <Box sx={styles.benefitBox}>
            <Box sx={styles.subtitleBox}>
              <PublicIcon sx={styles.subtitleIcon} />
              <Typography sx={styles.subtitle}>Decentralized</Typography>
            </Box>
            <Typography>
              To store data, we use censorship resistant public peer-to-peer
              networks, instead of centralized servers which can be a single
              point of failure.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box id="why" sx={styles.Box}>
        <Container maxWidth="sm">
          <Typography style={styles.title}>Why are we here.</Typography>
          <Box sx={styles.missionBox}>
            <Image
              src="/ghost-icon-black.svg"
              height={130}
              width={130}
              alt="Ghost Logo"
            />
            <Typography sx={styles.missionText}>
              Our mission is to{" "}
              <span style={styles.bold}>bring the millions of people</span> –
              who are currently using centralized file transfer services –{" "}
              <span style={styles.bold}>to Web3.</span> In order to do so, we’re
              discovering new approaches to make file sharing user-friendly,
              without giving up privacy!
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box id="how" sx={styles.Box}>
        <Typography style={styles.title}>How it works.</Typography>
        <Box sx={styles.missionBox}>
          <Typography sx={styles.subtitle}>
            A simplified Version of what happens under the hood.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={2}>
              <Box sx={{ width: "60vw", height: "27vw", position: "relative" }}>
                <Image
                  src="/sequence-diagram-upload-download.png"
                  alt="Sequence Digram for Upload and Download"
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            </Paper>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                maxWidth: "600px",
                marginTop: "20px",
                marginBottom: "25px",
              }}
            >
              <ol>
                <li>
                  When uploading a file, the file gets encrypted (locally in
                  your browser) with the help of the Lit Network.
                </li>
                <li>
                  The encrypted file get stored on IPFS and the corresponding
                  Metadata are registered in{" "}
                  <a
                    href={`https://mumbai.polygonscan.com/address/${contracts.FileRegistry}#code`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    our Smart Contract
                  </a>
                  .
                </li>
                <li>
                  You share a file with a custom link, whereupon the recipient
                  must request access – because the link itself is publicly
                  available.
                </li>
                <li>
                  If the recipient has been granted access, they can download
                  and decrypt the file.
                </li>
              </ol>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default WhatWhyHow;
