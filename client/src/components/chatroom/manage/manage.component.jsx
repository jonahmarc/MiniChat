import { useState, useRef, useEffect } from "react";
import axios from "axios";

import { Button, Modal, Form, Toast } from "react-bootstrap";

import { connect } from "react-redux";

function ManageChatRoom ({type, room_id, name, password, currentUser}) {
  
  const roomName = useRef();
  const roomPrivacy = useRef();
  const roomPassword = useRef();
    
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [checked, setChecked] = useState();

  
  const [showDel, setShowDel] = useState(false);

  const handleCloseDel = () => setShowDel(false);
  const handleShowDel = () => {
    handleClose()
    setShowDel(true)
  }

  
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  useEffect (() => {

  }, [showToast, error, toastMsg]);

  let toastMessage;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (type == 'CREATE') {
      let URL = 'http://localhost:8080/kachat/rooms/'+currentUser.user_id;
      console.log(URL)

      if (roomPassword.current != undefined){
        axios.post(URL, {
            "name": roomName.current.value,
            "private": roomPrivacy.current.checked,
            "password": roomPassword.current.value
          })
          .then( result => {
            toastMessage = "You have successfully created a new room!";
            setToastMsg(toastMessage)
            setShowToast(true)
            handleClose()
            window.setTimeout(function(){window.location.reload()},4000)
            // window.location.reload(false);
          }).catch( error => {
            setError(error.response.data.response_details.message)
          })
      }
      else {
        axios.post(URL, {
            "name": roomName.current.value,
            "private": roomPrivacy.current.checked
          })
          .then( result => {
            toastMessage = "You have successfully created a new room!";
            setToastMsg(toastMessage)
            setShowToast(true)
            handleClose()
            window.setTimeout(function(){window.location.reload()},4000)
            // window.location.reload(false);
          }).catch( error => {
            setError(error.response.data.response_details.message)
          })
      }
    }
    else if (type == 'UPDATE'){
      let URL = 'http://localhost:8080/kachat/rooms/update/'+room_id;
      console.log(URL)

      if (roomPassword.current != undefined){
        axios.put(URL, {
            "name": roomName.current.value,
            "private": roomPrivacy.current.checked,
            "password": roomPassword.current.value
          })
          .then( result => {
            toastMessage = "You have successfully updated the room!";
            setToastMsg(toastMessage)
            setShowToast(true)
            handleClose()
            window.setTimeout(function(){window.location.reload()},4000)
            // window.location.reload(false)
          }).catch( error => {
            setError(error.response.data.response_details.message)
          })
      }
      else {
        axios.put(URL, {
            "name": roomName.current.value,
            "private": roomPrivacy.current.checked
          })
          .then( result => {
            toastMessage = "You have successfully updated the room!";
            setToastMsg(toastMessage)
            setShowToast(true)
            handleClose()
            window.setTimeout(function(){window.location.reload()},4000)
            // window.location.reload(false)
          }).catch( error => {
            setError(error.response.data.response_details.message)
          })
      }
    }
    
};

    const deleteRoom = () => {
      axios.delete('http://localhost:8080/kachat/rooms/'+room_id)
      .then( result => {
        toastMessage = "You have successfully deleted the room!";
        setToastMsg(toastMessage)
        setShowToast(true)
        handleClose()
        window.location.reload(false);
      }).catch( error => {
          setError(error.response.data.response_details.message)
      })
    }

    let btn;
    let title;
    let del;

    if(type == 'CREATE') {
        btn = <Button onClick={handleShow}>
                    <i className="bi bi-plus-lg"></i>
                </Button>;
        title = "Create New";
    }
    else if (type == 'UPDATE') {
        btn = <Button onClick={handleShow}>
                    <i className="bi bi-gear"></i>
                </Button>;
        title = "Update";
        del = <Button className="me-auto" variant="outline-danger" onClick={handleShowDel}>
                    DELETE  
                </Button>;
    }

  return (
    <>
      {btn}
      <Modal centered="true" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title} Chat Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form  onSubmit={handleSubmit} >
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check 
                  ref={roomPrivacy}
                  checked={checked} 
                  type="checkbox" 
                  label="Set Private" 
                  onChange={(e) => setChecked(e.target.checked)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control 
                  ref={roomName}
                  type="text" 
                  placeholder="Enter Room Name" 
                  defaultValue={name}
                  required/>
            </Form.Group>
            {  error && 
                  <h6 style={{color: 'red'}}>{error}</h6>
            }
            {checked && (
                <Form.Group className="mb-3">
                    <Form.Control 
                    ref={roomPassword}
                    type="text" 
                    placeholder="Password" 
                    defaultValue={password}
                    required/>
                </Form.Group>
            )}
            <Form.Group className="d-grid gap-2 d-md-flex justify-content-md-end">
                
                {del}
                <Button  variant="secondary" onClick={handleClose}>
                    CANCEL  
                </Button>
                <Button className="ml-5" type="submit" variant="primary">
                    {type}
                </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal centered='true' show={showDel} onHide={handleCloseDel}>
        <Modal.Header closeButton>
            Are you sure you want to DELETE the room?
        </Modal.Header>
        {  error && 
            <Modal.Body><h6 style={{color: 'red'}}>{error}</h6></Modal.Body>
        }
        <Modal.Footer> 
            <Button  variant="secondary" onClick={handleCloseDel}>CANCEL</Button>
            <Button className="ml-5" variant="primary" onClick={deleteRoom}>YES</Button>
        </Modal.Footer>
      </Modal>

      <Toast className='position-fixed bottom-0 start-0 mb-3 ms-3' 
        bg='success' onClose={() => setShowToast(false)} show={showToast} 
        delay={6000} 
        autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body style={{color: 'white'}}>{toastMsg}</Toast.Body>
      </Toast>
    </>
  );
};

const mapStateToProps = ({user}) => ({
    currentUser: user.currentUser
});

export default connect(mapStateToProps)(ManageChatRoom);