import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Link,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import RadialBackground from "../../components/RadialBackground";
import filterTransactions from "../../src/utils/filterTransactions";
import keyToEmojis from "../../src/utils/keyToEmojis";

const styles = {
  card: {
    zIndex: "10",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "stretch",
    borderRadius: "30px",
    padding: "0px",
    paddingRight: "15px",
    paddingLeft: "15px",
    marginTop: "50px",
  },
  cardContent: {
    padding: "0px",
    paddingTop: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
};

export default function Account() {
  // TODO get public key from local storage
  const [userAddress, setUserAddress] = useState(
    "0x6Dc72847c5F2f0C07354B89dB336410eEc8bb721"
  );
  const [userTransactions, setUserTransactions] = useState(null);
  const [sharedFiles, setSharedFiles] = useState(null);
  const [receivedFiles, setReceivedFiles] = useState(null);

  // NOTE Covalent API https://www.covalenthq.com/docs/api/#/0/Get%20transactions%20for%20address/USD/1
  const getUserTransactions = async () => {
    try {
      const URL = `https://api.covalenthq.com/v1/80001/address/${userAddress}/transactions_v2/?block-signed-at-asc=true&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      console.log({ URL });
      const response = await Axios.get(URL);
      console.log({ response });
      setUserTransactions(response?.data?.data?.items);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (userTransactions) {
      const filteredTransactions = filterTransactions(
        userTransactions,
        userAddress
      );
      setSharedFiles(filteredTransactions.sharedFiles);
      setReceivedFiles(filteredTransactions.receivedFiled);
    }
  }, [userTransactions, userAddress]);
  console.log({ sharedFiles });
  console.log({ receivedFiles });

  return (
    <RadialBackground>
      <Navbar color="white" shortVersion={true} />
      <Container maxWidth="md" sx={{ marginTop: "150px" }}>
        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Your GhostShare.xyz Account
        </Typography>

        <Card sx={styles.card} elevation={3}>
          <CardContent sx={styles.cardContent}>
            <Typography sx={styles.cardTitle}>Shared Files</Typography>
            {sharedFiles?.length ? (
              <>
                {sharedFiles.map((file) => (
                  <Box
                    mt={2}
                    key={file.fileId}
                    sx={{ minWidth: { xs: 0, md: "600px" } }}
                  >
                    <Typography>
                      <span style={{ fontWeight: "bold" }}>
                        {file.fileId.slice(0, 10) + ".zip"}
                      </span>{" "}
                      (Size: 423 MB)
                    </Typography>
                    <Divider />
                    <Typography mt={1} mb={1}>
                      Shared with:
                    </Typography>
                    {file.recipients.map((recipient) => (
                      <Box
                        mt={1}
                        sx={{ display: "flex", alignItems: "center" }}
                        key={recipient.recipient}
                      >
                        <Box
                          sx={{
                            letterSpacing: "15px",
                            fontSize: { xs: "0.9rem", md: "1.5rem" },
                            borderRadius: "30px",
                            border: "1px solid #e4e4e4",
                            padding: "6px 12px",
                            paddingRight: "0px",
                            marginRight: "10px",
                            minWidth: "150px",
                          }}
                        >
                          {keyToEmojis(recipient.recipient).slice(0, 8)}
                        </Box>
                        <Typography
                          sx={{ fontSize: "0.8rem" }}
                        >{`Granted at ${recipient.timeGranted}`}</Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </>
            ) : (
              <>
                <Typography mt={1}>You haven't shared a file yet.</Typography>
                <Button variant="contained" href="/" sx={{ marginTop: "20px" }}>
                  Share File
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card sx={styles.card} elevation={3}>
          <CardContent sx={styles.cardContent}>
            <Typography sx={styles.cardTitle}>Received Files</Typography>
            {receivedFiles?.length ? (
              <>
                {receivedFiles.map((file) => (
                  <Box
                    mt={2}
                    key={file.fileId}
                    sx={{ minWidth: { xs: 0, md: "600px" } }}
                  >
                    <Typography>
                      <span style={{ fontWeight: "bold" }}>
                        {file.fileId.slice(0, 10) + ".zip"}
                      </span>{" "}
                      (Size: 423 MB)
                    </Typography>
                    <Divider />
                    <Box
                      sx={{
                        display: { xs: "block", md: "flex" },
                        alignItems: "center",
                      }}
                    >
                      <Typography mt={1} mb={1} pr={1}>
                        Download at:
                      </Typography>

                      <Link
                        href={`https://www.ghostshare.xyz/file/${file.fileId}`}
                      >
                        <Typography
                          sx={{
                            maxWidth: { xs: "250px", md: "350px" },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {`https://www.ghostshare.xyz/file/${file.fileId}`}
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              <>
                <Typography mt={1}>You haven't received a file yet.</Typography>
              </>
            )}
          </CardContent>
        </Card>

        <Button
          variant="contained"
          size="small"
          onClick={getUserTransactions}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10000,
          }}
        >
          tx's
        </Button>
      </Container>
    </RadialBackground>
  );
}
