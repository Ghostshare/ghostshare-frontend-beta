import React from "react";
import { Typography, Container, Link } from "@mui/material";

const styles = {
  footerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "sticky",
    height: "55px",
  },
  footer: {
    display: "inline-flex",
  },
  link: {
    color: "black",
    textDecoration: "none",
    paddingLeft: "10px",
  },
};

const Footer = () => {
  return (
    <Container maxWidth="md" sx={styles.footerContainer}>
      <footer style={styles.footer}>
        <Typography>GhostShare created with 🖤</Typography>
        <Link sx={styles.link} href="/thanks">
          with thanks to ...
        </Link>
      </footer>
    </Container>
  );
};

export default Footer;
