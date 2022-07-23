import React, { useState } from "react";
import { Typography, Grid, Container, Box, Link } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import ShareFile from "../components/ShareFile";
import WhatWhyHow from "../components/WhatWhyHow";
import styles from "../styles/Home.module.css";
import Footer from "../components/Footer";

export default function Home() {
  const [isUploadStarted, setIsUploadStarted] = useState(false);

  const [shownWalletInfoModal, setShownWalletInfoModal] = useLocalStorageState(
    "shownWalletInfoModal",
    {
      defaultValue: false,
    }
  );

  const Styles = {
    heroText: {
      display: {
        xs: !isUploadStarted ? "block" : "none",
        md: "block",
      },
    },
  };

  return (
    <div>
      <Head>
        <title>Ghostshare</title>
        <meta name="description" content="Private File Transfer. Simplified." />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👻</text></svg>"
        ></link>
      </Head>
      <Box
        className={`${styles.animation} ${styles.main}`}
        sx={{
          backgroundColor: "black",
          position: "sticky",
          top: 0,
          width: "100%",
        }}
      >
        
        <Navbar color="white" />
        <Container maxWidth="md">
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              sx={{
                display: "flex",
                alignItems: "flex-start",
                marginTop: { xs: "50px", md: "150px" },
              }}
            >
              <Grid item xs={12} md={6} sx={Styles.heroText}>
                <Typography
                  variant="h1"
                  sx={{
                    whiteSpace: "pre-line",
                    color: "white",
                    textAlign: { xs: "center", md: "left" },
                    fontSize: { xs: "3rem", sm: "4rem", md: "4.7rem" },
                  }}
                >
                  {`Private 
                      File Sharing. 
                      Simplified.`}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  marginTop: "25px",
                  paddingLeft: { xs: "0px", md: "50px" },
                  paddingTop: { xs: "50px", md: "0px" },
                }}
              >
                <ShareFile setIsUploadStarted={setIsUploadStarted} />
              </Grid>
            </Grid>
          </Box>
        </Container>
        <div className={`${styles.trails} ${styles.trail1}`}></div>
        <div className={`${styles.trails} ${styles.trail2}`}></div>
        <div className={`${styles.trails} ${styles.trail3}`}></div>
        <div className={`${styles.trails} ${styles.trail4}`}></div>
        <div className={`${styles.trails} ${styles.trail5}`}></div>
        <div className={`${styles.trails} ${styles.trail6}`}></div>
        <div className={`${styles.trails} ${styles.trail7}`}></div>
        <div className={`${styles.trails} ${styles.trail8}`}></div>
        <div className={`${styles.trails} ${styles.trail9}`}></div>
        <Box
          sx={{
            position: "absolute",
            bottom: "-42px",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link href={"#what"} sx={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  position: "relative",
                  top: "10px",
                  left: "2px",
                }}
              >
                learn more
              </Typography>
              <Box sx={{ transform: "rotate(180deg)" }}>
                <Image
                  src="/ghost-icon.svg"
                  height={80}
                  width={80}
                  alt="Ghost Logo"
                />
              </Box>
            </Box>
          </Link>
        </Box>
      </Box>

      <WhatWhyHow />
      <Footer />
    </div>
  );
}
