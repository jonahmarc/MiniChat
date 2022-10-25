import { useState, useEffect, useRef } from "react";

import { Button, ListGroup, Modal, Form, Toast } from "react-bootstrap";
import makeToast from "../../toast/toaster";

import axios from 'axios';

import { connect } from "react-redux";
import { setCurrentRoom } from "../../../redux/room/room.action";

function RoomsListAll ({ setCurrentRoom, currentUser, currentRoom}){

    const roomPassword = useRef();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [roomData, setRoomData] = useState([]);
  const [selectedRoom, setselectedRoom] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  


  useEffect(() => {
    if (isLoading) {
      axios.get('http://localhost:8080/kachat/rooms/'+currentUser.user_id)
      .then( result => {
        console.log('list-all')
        setRoomData(result.data.data.rooms_list)
      }).catch( error => {
        makeToast("error", error.message)
        window.setTimeout(function(){window.location.reload()},2000)
      })
      setIsLoading(false);
    }
    
  }, [isLoading, roomData, error, show, selectedRoom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:8080/kachat/rooms/join/'+selectedRoom.room_id+'?user_id='+currentUser.user_id, {
        "password": roomPassword.current.value
    })
      .then( result => {
        setCurrentRoom({...selectedRoom, ["joined"]:true})
        handleClose()
        makeToast("success", result.data.response_details.message)
        window.setTimeout(function(){window.location.reload()},2000)
      }).catch( error => {
        setError(error.response.data.response_details.message)
      })
  }

  const selectRoom = (room) => {

    if (room.joined) {
        setCurrentRoom(room)
    }
    else {
        if (room.locked) {
            setselectedRoom(room)
            handleShow()
        }
        else {
            axios.put('http://localhost:8080/kachat/rooms/join/'+room.room_id+'?user_id='+currentUser.user_id)
              .then( result => {
                setCurrentRoom({...room, ["joined"]:true})
                console.log(result)
                makeToast("success", result.data.response_details.message)
                window.setTimeout(function(){window.location.reload()},2000)
              }).catch( error => {
                makeToast("error", error.message)
                window.setTimeout(function(){window.location.reload()},2000)
              })
        }
    }
  }

  return (
    <>
    <ListGroup className="rooms_list">
          {
            roomData.map( (room, index) => (
              <ListGroup.Item
                key={index}
                action
                variant="light"
                className="d-grid gap-2 d-flex align-items-center justify-content-start"
                onClick={ (e) => selectRoom(room)}
                >
                {room.joined ? <i className="bi bi-check-circle-fill text-success" variant="success"></i> :
                                <i className="bi bi-check-circle-fill" variant=""></i>
                }
                
                <figure className="d-flex flex-column align-items-start justify-content-start m-0 p-0">
                    <blockquote class="blockquote m-0 p-0">
                      <h6>{room.name}</h6>
                    </blockquote>
                    <figcaption class="blockquote-footer m-0 p-0">
                      {room.owner.display_name}
                    </figcaption>
                </figure>
                {room.locked ? <i className="ms-auto bi bi-lock-fill"></i> : <i className="ms-auto bi bi-unlock"></i>}
              </ListGroup.Item>
            ))
          }
          <Modal centered="true" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Enter Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form  onSubmit={handleSubmit} >
                  <Form.Group className="mb-3">
                      <Form.Control 
                      ref={roomPassword}
                      type="text" 
                      placeholder="Password" 
                      required/>
                  </Form.Group>
                  {   error && 
                        <h6 style={{color: 'red'}}>{error}</h6>
                  }
                  <Form.Group className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <Button  variant="secondary" onClick={handleClose}>
                          CANCEL  
                      </Button>
                      <Button className="ml-5" type="submit" variant="primary">
                          JOIN
                      </Button>
                  </Form.Group>
              </Form>
            </Modal.Body>
          </Modal>
        </ListGroup>
    </>
  );
};

const mapStateToProps = ({user: {currentUser}, room: {currentRoom}}) => ({
  currentUser,
  currentRoom

});

const mapDispatchToProps = (dispatch) => ({
  setCurrentRoom: (room) => dispatch(setCurrentRoom(room)),
});

export default connect(mapStateToProps,mapDispatchToProps)(RoomsListAll);