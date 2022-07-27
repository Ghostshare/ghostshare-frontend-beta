import React from "react";
import Head from "next/head";
import { Typography, Grid, Container, Box, Link } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ForwardIcon from "@mui/icons-material/Forward";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Thanks.module.css";

const Styles = {
  grid: { marginTop: "0px" },
  gridItem: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
    color: "white",
    marginTop: "30px",
  },
  brand: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "13px",
  },
};

export default function Thanks() {
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
        <Navbar color="white" shortVersion={true} />
        <Container maxWidth="md">
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "60px",
            }}
          >
            <Typography variant="h2" color="white">
              Thank you! <FavoriteBorderIcon />
            </Typography>
            <Typography color="white" sx={{ fontSize: "1.5rem" }}>
              The following companies support our service.
            </Typography>
            <Grid container sx={Styles.grid} spacing={2}>
              <Grid item xs={12} sm={6} md={4} sx={Styles.gridItem}>
                <Typography sx={Styles.brand}>IPFS & Web3.Storage</Typography>
                <Typography>
                  IPFS powers the Distributed Web. And Web3.Storage, the easiest
                  way to store data on the decentralized web. Store your data
                  using our simple API. It’s fast, open, and it’s free.
                </Typography>
                <div style={{ display: "flex" }}>
                  <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
                    <Typography
                      sx={{
                        display: "flex",
                        fontWeight: "bold",
                        marginTop: "5px",
                      }}
                    >
                      <ForwardIcon /> IPFS
                    </Typography>
                  </a>{" "}
                  <a
                    href="https://web3.storage/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        fontWeight: "bold",
                        marginTop: "5px",
                      }}
                    >
                      <ForwardIcon sx={{ marginLeft: "10px" }} /> Web3.Storage
                    </Typography>
                  </a>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={Styles.gridItem}>
                <Typography sx={Styles.brand}>Lit Protocol</Typography>
                <Typography>
                  Decentralized Access Control for Web3 Apps and Private Data on
                  the Open Web. Lit Protocol provides decentralized
                  identity-based encryption and access control.
                </Typography>
                <a
                  href="https://litprotocol.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    <ForwardIcon /> Lit Protocol
                  </Typography>
                </a>
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={Styles.gridItem}>
                <Typography sx={Styles.brand}>Polygon</Typography>
                <Typography>
                  Polygon is a decentralised Ethereum scaling platform that
                  enables developers to build scalable user-friendly dApps with
                  low transaction fees without ever sacrificing on security.
                </Typography>
                <a
                  href="https://polygon.technology/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    <ForwardIcon /> Polygon
                  </Typography>
                </a>
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={Styles.gridItem}>
                <Typography sx={Styles.brand}>Covalent</Typography>
                <Typography>
                  One unified API One billion possibilities. Covalent provides a
                  unified API bringing visibility to billions of Web3 data
                  points.
                </Typography>
                <a
                  href="https://www.covalenthq.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    <ForwardIcon />
                    Covalent
                  </Typography>
                </a>
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={Styles.gridItem}>
                <Typography sx={Styles.brand}>XMTP</Typography>
                <Typography>
                  XMTP is a messaging protocol and decentralized communication
                  network that enables blockchain wallet addresses to send
                  messages to other wallet addresses.
                </Typography>
                <a href="https://xmtp.org/" target="_blank" rel="noreferrer">
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    <ForwardIcon />
                    XMTP
                  </Typography>
                </a>
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={Styles.gridItem}>
                <Typography sx={Styles.brand}>Vercel</Typography>
                <Typography>
                  Vercel combines the best developer experience with an
                  obsessive focus on end-user performance. Vercel platform
                  enables frontend teams to do their best work.
                </Typography>
                <a href="https://vercel.com/" target="_blank" rel="noreferrer">
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    <ForwardIcon />
                    Vercel
                  </Typography>
                </a>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
