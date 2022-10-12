
import './search.component.scss';

import { Form, Button } from 'react-bootstrap';

const SearchRoom = () => {
    return (
        <Form className='search_form'>
            <Form.Group controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Search Roooms"  />
            </Form.Group>
            <Button variant="light" type='submit'><i class="bi bi-search"></i></Button>
        </Form>
    );
}

export default SearchRoom;