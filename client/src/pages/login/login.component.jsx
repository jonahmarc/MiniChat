import './login.component.scss';
import { Stack } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';

const Login = () => {
    return (
        <div className='login_container'>
            <h1>WELCOME TO KACHAT!</h1>
            <Form className='login_form'>
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Enter username" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    LOGIN
                </Button>
            </Form>
        </div>
    );
}

export default Login;