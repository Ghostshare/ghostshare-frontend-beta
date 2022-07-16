import { Typography } from "@mui/material";
import { Container, Box } from "@mui/system";
import Head from "next/head";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";

export default function Home() {
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
          <Typography
            variant="h1"
            style={{ whiteSpace: "pre-line", color: "white" }}
          >
            {`Private 
          File Sharing. 
          Simplified.`}
          </Typography>
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
      </Box>

      <Box
        className={styles.main}
        id="what"
        sx={{ backgroundColor: "white", position: "sticky", top: 0 }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" style={{ whiteSpace: "pre-line" }}>
            What is it for.
          </Typography>
          <Typography>Lorem...</Typography>
        </Container>
      </Box>

      <Box
        className={styles.main}
        id="why"
        sx={{ backgroundColor: "blue", position: "sticky", top: 0 }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" style={{ whiteSpace: "pre-line" }}>
            Why are we here.
          </Typography>
        </Container>
      </Box>

      <Box
        className={styles.main}
        id="how"
        sx={{ backgroundColor: "green", position: "sticky", top: 0 }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" style={{ whiteSpace: "pre-line" }}>
            How it works.
          </Typography>
        </Container>
      </Box>
      <footer className={styles.footer}>Created with 🖤</footer>
    </div>
  );
}
