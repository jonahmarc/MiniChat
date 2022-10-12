import { useState } from "react";

import { Button, Modal, Form } from "react-bootstrap";

const ManageChatRoom = (props) => {

    
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

    let btn;
    let title;

    if(props.type == 'CREATE') {
        btn = <Button onClick={handleShow}>
                    <i class="bi bi-plus-lg"></i>
                </Button>;
        title = "Create New";
    }
    else if (props.type == 'MANAGE') {
        btn = <Button onClick={handleShow}>
                    <i class="bi bi-gear"></i>
                </Button>;
        title = "Update";
    }


    return (
        <>
            {btn}

            <Modal centered='true' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{title} Chat Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form  noValidate validated={validated} onSubmit={handleSubmit} >
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check checked={checked} type="checkbox" label="Set Private" onChange={(e) => setChecked(e.target.checked)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Enter Room Name" required/>
                        </Form.Group>
                        {checked && (
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Password" required/>
                            </Form.Group>
                        )}
                        <Form.Group className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Button  variant="secondary" onClick={handleClose}>
                                CANCEL  
                            </Button>
                            <Button className="ml-5" type="submit" variant="primary">
                                {props.type}
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ManageChatRoom;