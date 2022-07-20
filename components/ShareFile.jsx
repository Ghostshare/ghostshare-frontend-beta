import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Input,
  Button,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DragAndDrop from "./DragAndDrop";

const styles = {
  card: {
    minHeight: "200px",
    zIndex: "10",
    display: "flex",
    borderRadius: "30px",
    justifyContent: "center",
  },
  cardContent: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
};

const ShareFile = () => {
  // States of the share file procedure
  // 1) waiting for user to select file
  // 2) waiting for user to click `upload file` -> isUploading: status = false
  // 3) waiting for file to be uploaded completly/successfuly -> isUploading: status = true, success, error
  // 4) Waiting for granting request from recipient -> isGranting: status = false
  // 5) Waiting for user to grant/decline file access  -> isGranting: status = true
  // 6) File was successfuly shared. isGranting: status = success
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState({ status: "false" }); // false, true, success, error
  const [isGranting, setIsGranting] = useState({ status: "false" }); // false, true, success

  const handleDelete = () => {
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0].name);
    setSelectedFile(e.target.files[0].name);
  };

  const uploadFile = () => {
    console.log("setIsUploading({ status: true })");
    setIsUploading({ status: "true" });
  };

  // Set the card content based on the stage in the share file procedure
  let cardContent;
  if (!selectedFile) {
    cardContent = (
      <>
        <label htmlFor="btn-upload">
          <Input
            id="btn-upload"
            type="file"
            onChange={handleFileChange}
            sx={{ display: "none" }}
          />
          <Button className="btn-choose" component="span" variant="outlined">
            Select File
          </Button>
        </label>
        <Typography pt={1}>Or drop a file inside the window.</Typography>
      </>
    );
  } else if (isUploading.status === "false") {
    cardContent = (
      <>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        >
          <Typography sx={{ fontWeight: "bold", paddingRight: "10px" }}>
            Your File
          </Typography>
          <Chip
            label={selectedFile}
            variant="outlined"
            onDelete={handleDelete}
          />
        </div>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={uploadFile}
          endIcon={<FileUploadIcon />}
        >
          Upload File
        </Button>
      </>
    );
  } else if (isUploading.status === "true") {
    cardContent = <h2>Uploading</h2>;
  }

  return (
    <>
      <Card sx={styles.card} elevation={3}>
        <CardContent sx={styles.cardContent}>{cardContent}</CardContent>
      </Card>
      <DragAndDrop setSelectedFile={setSelectedFile} />
    </>
  );
};

export default ShareFile;
