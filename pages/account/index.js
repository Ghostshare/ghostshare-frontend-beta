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
  Input,
} from "@mui/material";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
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

  const [isPrivateKeyShown, setIsPrivateKeyShown] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [restoredPrivateKey, setRestoredPrivateKey] = useState("");

  const showPrivateKey = () => {
    // TODO add get key from local storage
    const key =
      "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036415f"; // hardcoded random 64 chars
    setPrivateKey(key);
    setIsPrivateKeyShown(true);
  };
  const hidePrivateKey = () => {
    setPrivateKey("");
    setIsPrivateKeyShown(false);
  };

  const handleInputRestoredPrivateKey = (event) => {
    setRestoredPrivateKey(event.target.value);
  };
  const restorePrivateKey = () => {
    // TODO add get key from local storage
    console.log("new private key set");
  };

  // NOTE Covalent API https://www.covalenthq.com/docs/api/#/0/Get%20transactions%20for%20address/USD/1
  const getUserTransactions = async () => {
    try {
      const URL = `https://api.covalenthq.com/v1/80001/address/${userAddress}/transactions_v2/?block-signed-at-asc=true&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      const response = await Axios.get(URL);
      // console.log({ response });
      setUserTransactions(response?.data?.data?.items);
    } catch (err) {
      console.log({ err });
    }
  };

  // TODO change useEffect: insert getUserTransactions and trigger based on userPublicKey from localStorage (with hook?)
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

        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginTop: "50px",
          }}
        >
          Backup or Restore
        </Typography>

        <Card sx={styles.card} elevation={3}>
          <CardContent sx={styles.cardContent}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingBottom: "10px",
              }}
            >
              <VpnKeyOutlinedIcon
                sx={{ marginRight: "10px", fontSize: "2rem" }}
              />
              <Typography sx={styles.cardTitle}>Your Account Key</Typography>
            </Box>
            <Box mt={2} sx={{ maxWidth: "500px" }}>
              <Typography sx={{ textAlign: "center" }}>
                Your <span style={{ fontWeight: "bold" }}>private key</span> is
                stored in your web browser. If you switch devices, you must{" "}
                <span style={{ fontWeight: "bold" }}>
                  restore your private key
                </span>{" "}
                to access your balance.
              </Typography>
            </Box>
            {!isPrivateKeyShown ? (
              <Button
                variant="outlined"
                onClick={showPrivateKey}
                sx={{ marginTop: "20px", minWidth: "250px" }}
              >
                Show Private Key
              </Button>
            ) : (
              <Box
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    background: " #2b75cd",
                    color: "white",
                    padding: "10px 20px",
                    marginBottom: "5px",
                    wordBreak: "break-all",
                  }}
                >
                  {privateKey}
                </Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  Store this key at a secure place!
                </Typography>
                <Button
                  variant="contained"
                  onClick={hidePrivateKey}
                  sx={{ marginTop: "20px", minWidth: "250px" }}
                >
                  Hide Private Key
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ ...styles.card, marginBottom: "200px" }} elevation={3}>
          <CardContent sx={styles.cardContent}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingBottom: "10px",
              }}
            >
              <SettingsBackupRestoreOutlinedIcon
                sx={{ marginRight: "10px", fontSize: "2rem" }}
              />
              <Typography sx={styles.cardTitle}>
                Restore Your Account
              </Typography>
            </Box>
            <Box mt={2} sx={{ maxWidth: "500px" }}>
              <Typography sx={{ textAlign: "center" }}>
                Paste the private key inside the field below and restore your
                account in this browser.
              </Typography>
            </Box>
            <Input
              placeholder="Your private Key"
              value={restoredPrivateKey}
              onChange={handleInputRestoredPrivateKey}
              sx={{ marginTop: "20px", minWidth: "300px" }}
            />
            <Button
              variant="outlined"
              onClick={restorePrivateKey}
              disabled={restoredPrivateKey.length !== 64}
              sx={{ marginTop: "20px", minWidth: "250px" }}
            >
              Restore Account
            </Button>
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
