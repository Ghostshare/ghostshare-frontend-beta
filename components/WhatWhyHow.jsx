import React from "react";
import { Typography, Container, Box } from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import PublicIcon from "@mui/icons-material/Public";

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
  subtitleBox: { display: "flex", marginBottom: "25px" },
  subtitleIcon: { fontSize: "3rem", marginRight: "15px" },
  subtitle: { fontSize: "2rem", fontWeight: "bold" },
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
        <Container maxWidth="md">
          <Typography variant="h1" style={{ whiteSpace: "pre-line" }}>
            Why are we here.
          </Typography>
          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Typography>
        </Container>
      </Box>

      <Box id="how" sx={styles.Box}>
        <Container maxWidth="md">
          <Typography variant="h1" style={{ whiteSpace: "pre-line" }}>
            How it works.
          </Typography>
          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default WhatWhyHow;
