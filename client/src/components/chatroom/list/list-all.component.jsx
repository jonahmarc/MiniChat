import { useState, useEffect, useRef } from "react";

import { Button, ListGroup, Modal, Form, Toast } from "react-bootstrap";

import axios from 'axios';

import { connect } from "react-redux";
import { setCurrentRoom } from "../../../redux/room/room.action";

function RoomsListAll ({ setCurrentRoom, currentUser, currentRoom}){

    const roomPassword = useRef();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [roomData, setRoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (isLoading) {
      axios.get('http://localhost:8080/kachat/rooms/'+currentUser.user_id)
      .then( result => {
        setRoomData(result.data.data.rooms_list)
      }).catch( error => {
          setError(error.message)
          setShowToast(true)
      })
      setIsLoading(false);
    }
    
  }, [isLoading, roomData, error, showToast, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:8080/kachat/rooms/join/'+currentRoom.room_id+'?user_id='+currentUser.user_id, {
        "password": roomPassword.current.value
    })
      .then( result => {
        handleClose()
        window.location.reload(false);
      }).catch( error => {
        console.log(error)
        setError(error.message)
        setShowToast(true)
      })
  }

  const selectRoom = (room) => {

    if (room.joined) {
        setCurrentRoom({...room, ["joined"]:true})
    }
    else {
        if (room.locked) {
            console.log("privateeeeeeeee")
            console.log(room);
            setCurrentRoom({...room, ["joined"]:true})
            handleShow()
        }
        else {
            axios.put('http://localhost:8080/kachat/rooms/join/'+room.room_id+'?user_id='+currentUser.user_id)
              .then( result => {
                setCurrentRoom({...room, ["joined"]:true})
                window.location.reload(false);
                console.log(result)
              }).catch( error => {
                setError(error.message)
                setShowToast(true)
              })
        }
    }
    console.log(room);
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
                
                <figure className="d-flex flex-column align-items-center m-0 p-0">
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
        <Toast className='position-fixed bottom-0 start-0 mb-3 ms-3' 
        bg='success' onClose={() => setShowToast(false)} show={showToast} 
        delay={6000} 
        autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>{error}</Toast.Body>
        </Toast>
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