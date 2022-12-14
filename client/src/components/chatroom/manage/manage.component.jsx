import { useState, useRef, useEffect } from "react";
import axios from "axios";

import { Button, Modal, Form, Toast } from "react-bootstrap";
import makeToast from "../../toast/toaster";

import { connect } from "react-redux";
import { setCurrentRoom } from "../../../redux/room/room.action";

function ManageChatRoom ({type, room_id, locked, name, password, currentUser, setCurrentRoom}) {
  
  const roomName = useRef();
  const roomPrivacy = useRef();
  const roomPassword = useRef();
  
    
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [checked, setChecked] = useState(locked);

  
  const [showDel, setShowDel] = useState(false);

  const handleCloseDel = () => setShowDel(false);
  const handleShowDel = () => {
    handleClose()
    setShowDel(true)
  }

  const [error, setError] = useState("");

  useEffect (() => {

  }, [show, error]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (type == 'CREATE') {
      let URL = 'http://localhost:8080/kachat/rooms/'+currentUser.user_id;
      console.log(URL)
      if (roomPrivacy.current.checked){
        axios.post(URL, {
            "name": roomName.current.value,
            "locked": roomPrivacy.current.checked,
            "password": roomPassword.current.value
          })
          .then( result => {
            handleClose()
            makeToast("success", result.data.response_details.message)
            window.setTimeout(function(){window.location.reload()},2000)
          }).catch( error => {
            setError(error.message)
            console.log("private error")
            console.log(error)
          })
      }
      else {
        axios.post(URL, {
            "name": roomName.current.value,
            "private": roomPrivacy.current.checked
          })
          .then( result => {
            handleClose()
            makeToast("success", result.data.response_details.message)
            window.setTimeout(function(){window.location.reload()},2000)
          }).catch( error => {
            setError(error.message)
            console.log(error)
          })
      }
    }
    else if (type == 'UPDATE'){
      let URL = 'http://localhost:8080/kachat/rooms/update/'+room_id;
      console.log(URL)

      if (roomPassword.current != undefined){
        axios.put(URL, {
            "name": roomName.current.value,
            "locked": roomPrivacy.current.checked,
            "password": roomPassword.current.value
          })
          .then( result => {
            handleClose()
            makeToast("success", result.data.response_details.message)
            window.setTimeout(function(){window.location.reload()},2000)
          }).catch( error => {
            setError(error.message)
            console.log(error)
          })
      }
      else {
        axios.put(URL, {
            "name": roomName.current.value,
            "locked": roomPrivacy.current.checked
          })
          .then( result => {
            handleClose()
            makeToast("success", result.data.response_details.message)
            window.setTimeout(function(){window.location.reload()},2000)
          }).catch( error => {
            setError(error.message)
            console.log(error)
          })
      }
    }
    
};

    const deleteRoom = () => {
      axios.delete('http://localhost:8080/kachat/rooms/'+room_id)
      .then( result => {
        handleCloseDel()
        setCurrentRoom(null)
        makeToast("success", result.data.response_details.message)
        window.setTimeout(function(){window.location.reload()},2000)
      }).catch( error => {
          setError(error.message)
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
                    defaultValue={locked ? password : ''}
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
    </>
  );
};

const mapStateToProps = ({user}) => ({
    currentUser: user.currentUser
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentRoom: (room) => dispatch(setCurrentRoom(room)),
})

export default connect(mapStateToProps,mapDispatchToProps)(ManageChatRoom);