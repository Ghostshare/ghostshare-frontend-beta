import { Typography } from "@mui/material";
import { Container } from "@mui/system";
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
      <Navbar />
      <Container className={styles.main}>
        <Typography variant="h2" style={{ whiteSpace: "pre-line" }}>
          {`Private 
          File-Sharing. 
          Simplified.`}
        </Typography>
      </Container>
      <footer className={styles.footer}>Created with 🖤</footer>
    </div>
  );
}
