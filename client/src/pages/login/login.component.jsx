import './login.component.scss';

import { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import { setCurrentUser } from '../../redux/user/user.action';
import { useNavigate } from 'react-router-dom';


const Login = ({ setCurrentUser} ) => {

    const navigate = useNavigate();

    const username = useRef();
    const password = useRef();

    let user;

    function handleSubmit(e) {
        e.preventDefault();
        user = {
            id: 1,
            username: username.current.value,
            password: password.current.value
        }
        
        setCurrentUser(user);
        console.log(user);

        navigate('/');

    }

    return (
        <div className='login_container'>
            <h1>WELCOME TO KACHAT!</h1>
            <Form className='login_form' onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control ref={username} type="text" placeholder="Enter username" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control ref={password} type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    LOGIN
                </Button>
            </Form>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(null, mapDispatchToProps)(Login);