import { useState } from "react";

import { Button, Modal, ListGroup } from "react-bootstrap";

import './leave.component.scss';

const LeaveChatRoom = () => {
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [checked, setChecked] = useState(false);

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <>
            
            <Button variant="light" onClick={handleShow}>Leave Chat Room</Button>

            <Modal centered='true' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    Are you sure you want to leave the room?
                </Modal.Header>
                <Modal.Footer> 
                    <Button  variant="secondary" onClick={handleClose}>CANCEL</Button>
                    <Button className="ml-5" variant="primary" onClick={handleClose}>YES</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LeaveChatRoom;