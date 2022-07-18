import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Input,
  Button,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const styles = {
  wrapper: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 99,
    textAlign: "center",
    left: 0,
    fontSize: "100px",
    color: "white",
    lineHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  wrapperContent: {
    zIndex: 98,
  },
  wrapperBackground: {
    position: "absolute",
    opacity: 0.8,
    background: "radial-gradient(#1572cf,#1f1013)",
    zIndex: 97,
    height: "100%",
    width: "100%",
  },
};

const Uploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showWrapper, setShowWrapper] = useState(false);

  let lastTarget = null;

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  });

  const handleDragEnter = (e) => {
    setShowWrapper(true);
    lastTarget = e.target;
  };
  const handleDragLeave = (e) => {
    if (e.target === lastTarget || e.target === document) {
      setShowWrapper(false);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setShowWrapper(false);

    setSelectedFile(e.dataTransfer.files[0]?.name);
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0].name);
    setSelectedFile(e.target.files[0].name);
  };

  return (
    <>
      <Card
        sx={{
          minHeight: "200px",
          zIndex: "10",
          display: "flex",
          borderRadius: "25px",
          justifyContent: "center",
        }}
        elevation={3}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {!selectedFile ? (
            <>
              <label htmlFor="btn-upload">
                <Input
                  id="btn-upload"
                  type="file"
                  onChange={handleFileChange}
                  sx={{ display: "none" }}
                />
                <Button
                  className="btn-choose"
                  component="span"
                  variant="outlined"
                >
                  Select File
                </Button>
              </label>
              <Typography pt={1}>Or drop a file inside the window.</Typography>
            </>
          ) : (
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
                endIcon={<FileUploadIcon />}
              >
                Upload File
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      {showWrapper && (
        <div className="wrapper" style={styles.wrapper}>
          <div style={styles.wrapperContent}>
            <Typography variant="h2" mb={3}>
              Just drop it!
            </Typography>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Upload your file by drag & drop into this area.
            </Typography>
          </div>

          <div style={styles.wrapperBackground} />
        </div>
      )}
    </>
  );
};

export default Uploader;
