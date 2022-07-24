import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const styles = {
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 800,
    bgcolor: "background.paper",
    borderRadius: "30px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
};

export default function WalletInfoModal() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const openModalDelay = () => {
      if (!localStorage.getItem("shownWalletInfoModal")) {
        console.log("open modal");
        setOpen(true);
        localStorage.setItem("shownWalletInfoModal", "true");
      }
    };
    setTimeout(openModalDelay, 1000);
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modalBox}>
          <Button
            onClick={handleClose}
            sx={{ position: "absolute", top: "10px", right: 0 }}
          >
            <CancelRoundedIcon />
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              paddingBottom: "10px",
            }}
          >
            <AccountCircleOutlinedIcon
              sx={{ marginRight: "10px", fontSize: "3rem" }}
            />
            <Typography sx={styles.modalTitle}>Account Generated!</Typography>
          </Box>
          <Typography
            id="modal-modal-description"
            sx={{
              fontWeight: "bold",
              marginBottom: "25px",
              textAlign: "center",
            }}
          >
            We’ve automatically generated and saved your GhotShare.xyz account
            inside the browser.
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}
          >
            Message from the engine room 👩‍🏭
          </Typography>
          <Box
            sx={{
              background: "#FFEE93",
              textTransform: "uppercase",
              padding: "10px 20px",
              marginBottom: "5px",
              wordBreak: "break-all",
            }}
          >
            <Typography>
              If you switch devices or clear the storage in your browser, you
              must restore your private key to access your files.
            </Typography>
          </Box>
          <Box sx={{ marginTop: "20px" }}>
            <Button
              variant="outlined"
              size="small"
              sx={{ minWidth: 220, mr: 1, mb: 2 }}
              href="/account"
            >
              Backup Private Key
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ minWidth: 220, mb: 2 }}
              onClick={handleClose}
            >
              Backup Later
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
