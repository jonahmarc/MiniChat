import { useState } from "react";

import { Button, Modal, ListGroup } from "react-bootstrap";

import './details.component.scss';

import LeaveChatRoom from "../leave/leave.component";

const Details = () => {
    
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
            <Button variant='light' onClick={handleShow}>
                <i class="bi bi-three-dots-vertical">
            </i></Button>

            <Modal centered='true' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body  className="modal-dialog-scrollable">
                    <strong>Members</strong>
                    <ListGroup variant="flush">
                        <ListGroup.Item>Jonah Marc</ListGroup.Item>
                        <ListGroup.Item>Prince</ListGroup.Item>
                        <ListGroup.Item>Mervin</ListGroup.Item>
                        <ListGroup.Item>Ian</ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <LeaveChatRoom onClick={handleClose} />
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Details;