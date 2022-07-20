import { Typography, Container, Box } from "@mui/material";

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
};

const WhatWhyHow = () => {
  return (
    <>
      <Box id="what" sx={styles.Box}>
        <Container maxWidth="md">
          <Typography variant="h1" style={{ whiteSpace: "pre-line" }}>
            What you can expect.
          </Typography>
          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Typography>
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
