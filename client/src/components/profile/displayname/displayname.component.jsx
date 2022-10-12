import { Form, Button } from 'react-bootstrap';

import './displayname.component.scss';

const Displayname = () => {

    return (
        <Form className="mb-3 ps-5 pe-5" >
            <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Enter Display Name" required/>
            </Form.Group>
            <Form.Group className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Button className="ml-5" type="submit" variant="primary">
                    UPDATE
                </Button>
            </Form.Group>
        </Form>
    );

}

export default Displayname;