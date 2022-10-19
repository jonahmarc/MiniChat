import React, { useState, useEffect } from "react";
import { Button, CloseButton } from "react-bootstrap";

const UploadFile = () => {

  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [inputFile, setInputFile] = useState(null)
  useEffect(() => {
    setInputFile(document.getElementById("input-file"))
  }, [])

  const handleUpload = () => {
    console.log(inputFile);
    inputFile?.click()
  }
  const handleDisplayFileDetails = () => {
    inputFile?.files && setUploadedFileName(inputFile.files[0].name)
    
    console.log(inputFile?.files);
  }

  const removeFile = () => {
    setUploadedFileName(null);
    console.log(inputFile?.files[0]);
    // setInputFile(null);
  }

  return (
    <div className="m-0 d-grid gap-1 d-flex align-items-center">
      <input
        id="input-file"
        onChange={handleDisplayFileDetails}
        className="d-none"
        type="file"
      />
      <Button
        className=""
        onClick={handleUpload}
        variant={uploadedFileName ? "success" : "light"}
      >
        <i class="bi bi-file-earmark"></i>
        {uploadedFileName ? uploadedFileName.slice(0,10) : ''}
      </Button>
      {uploadedFileName && (
        <CloseButton onClick={removeFile} />
      )}
    </div>
  );
}

export default UploadFile;