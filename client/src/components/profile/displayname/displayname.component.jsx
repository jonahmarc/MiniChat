import { useState } from 'react';

import { Form, Button, Toast } from 'react-bootstrap';

import './displayname.component.scss';

const Displayname = () => {

    
    const [show, setShow] = useState(false);

    return (
        <>
            <Form className="mb-3 ps-5 pe-5" >
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Enter Display Name" required/>
                </Form.Group>
                <Form.Group className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button className="ml-5" type="submit" variant="primary" onClick={() => setShow(true)}>
                        UPDATE
                    </Button>
                </Form.Group>
            </Form>
            <Toast className='position-absolute bottom-0 start-0 mb-3 ms-3' bg='success' onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>Display Name updated successfully!</Toast.Body>
            </Toast>
        </>
    );

}

export default Displayname;