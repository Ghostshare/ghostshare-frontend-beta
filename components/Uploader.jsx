import { Typography, Card, CardContent, Button, Chip } from "@mui/material";
import { useEffect, useState } from "react";

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
  const [file, setFile] = useState(null);
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
    
    setFile(e.dataTransfer.files);
  };

  const handleDelete = () => {
    setFile(null);
  };

  return (
    <>
      <Card
        sx={{
          minHeight: "200px",
          zIndex: "10",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "25px",
        }}
        elevation={3}
      >
        <CardContent>
          <Button variant="contained">Upload File</Button>
          <Typography>or drop a file</Typography>
          {file && (
            <Chip
              label={`Your File: ${file[0]?.name}`}
              variant="outlined"
              onDelete={handleDelete}
            />
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
