import React, { useState, useEffect } from "react";
import { Button, CloseButton, Form } from "react-bootstrap";
import { setCurrentFile } from "../../../redux/folder/file.action";
import { connect } from "react-redux";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

const UploadFile = ({setCurrentFile}) => {

  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [inputFile, setInputFile] = useState(null)
  useEffect(() => {
    setInputFile(document.getElementById("input-file"))
  }, [])

  const handleUpload = () => {
    console.log('HANDLE UPLOAD')
    console.log(inputFile);
    inputFile?.click()
    
  }
 
  const onSubmit = (e) => {

  }
  const handleDisplayFileDetails = (e) => {
    
    
    
    inputFile?.files && setUploadedFileName(inputFile.files[0].name)

    console.log("HANDLE DISPLAY FILE",inputFile?.files);

    console.log("INPUT FILE: ", inputFile)

    const data = new FormData()
    data.append('file',inputFile?.files)
    console.log('FORM: ',data)

  }

  const removeFile = () => {
    setUploadedFileName(null);
    console.log(inputFile?.files[0]);
    // setInputFile(null);
  }

  return (
    <Form className="m-0 d-grid gap-1 d-flex align-items-center" method="post" action="#" id="#" onSubmit={onSubmit}>
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
        <i className="bi bi-file-earmark"></i>
        {uploadedFileName ? uploadedFileName.slice(0,10) : ''}
      </Button>
      {uploadedFileName && (
        <CloseButton onClick={removeFile} />
      )}
    </Form>
  );
}


const mapDispatchToProps = (dispatch) => ({
  setCurrentFile: (file) => dispatch(setCurrentFile(file))
})
export default connect(null, mapDispatchToProps)(UploadFile);