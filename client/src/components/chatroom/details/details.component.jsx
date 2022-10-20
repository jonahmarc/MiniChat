import { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";

import { Button, Modal, ListGroup } from "react-bootstrap";

import './details.component.scss';

import LeaveChatRoom from "../leave/leave.component";

function Details({currentUser, currentRoom}) {

    console.log(currentUser)
    console.log(currentRoom)
    
    const [show, setShow] = useState(false);
    const [members, setMembers] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        axios.get('http://localhost:8080/kachat/rooms/members/'+currentRoom.room_id)
        .then( result => {
            setMembers(result.data.data.members)
            console.log(result.data.data.members)
        }).catch( error => {
            console.log(error)
        })
        setShow(true)
    };

    return (
        <>
            <Button variant='light' onClick={handleShow}>
                <i className="bi bi-three-dots-vertical">
            </i></Button>

            <Modal centered='true' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body  className="modal-dialog-scrollable">
                    <strong>Members</strong>
                    <ListGroup variant="flush">
                        {
                            members.map( (members) => (
                                <ListGroup.Item>{members.display_name}</ListGroup.Item>
                            ))
                        }
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    { currentRoom.owner.username != currentUser.username ? 
                    <LeaveChatRoom onClick={handleClose} user_id={currentUser.user_id} room_id={currentRoom.room_id} /> : null}
                </Modal.Footer>
            </Modal>
        </>
    );
}

const mapStateToProps = ({user: {currentUser}, room: {currentRoom}}) => ({
    currentUser,
    currentRoom
});

export default connect(mapStateToProps)(Details);