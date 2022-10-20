import { useState, useEffect } from "react";

import axios from "axios";
import { connect } from "react-redux";

import { setCurrentRoom } from "../../../redux/room/room.action";

import { Button, Modal, Toast } from "react-bootstrap";

import './leave.component.scss';

function LeaveChatRoom ({user_id, room_id, setCurrentRoom}) {
    
    const [show, setShow] = useState(false);
    let toastMessage;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [error, setError] = useState("");

    useEffect (() => {

    }, [show, error ]);

    const leaveChatRoom = () => {
        axios.put('http://localhost:8080/kachat/rooms/leave/'+room_id+'?user_id='+user_id)
        .then( result => {
            handleClose()
            setCurrentRoom(null)
            window.location.reload(false);
        }).catch( error => {
            setError(error.response.data.response_details.message)
        })
    };

    return (
        <>
            
            <Button variant="light" onClick={handleShow}>Leave Chat Room</Button>

            <Modal centered='true' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    Are you sure you want to LEAVE the room?
                </Modal.Header>
                {  error && 
                    <Modal.Body><h6 style={{color: 'red'}}>{error}</h6></Modal.Body>
                }
                <Modal.Footer> 
                    <Button  variant="secondary" onClick={handleClose}>CANCEL</Button>
                    <Button className="ml-5" variant="primary" onClick={leaveChatRoom}>YES</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const mapDispatchToProps = (dispatch) => ({
    setCurrentRoom: (room) => dispatch(setCurrentRoom(room)),
});

export default connect(null,mapDispatchToProps)(LeaveChatRoom);