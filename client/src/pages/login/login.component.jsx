import './login.component.scss';

import { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import axios from 'axios';

import { setCurrentUser } from '../../redux/user/user.action';
import { useNavigate } from 'react-router-dom';


const Login = ({ setCurrentUser} ) => {

    const navigate = useNavigate();

    const username = useRef();
    const password = useRef();

    let error_message;

	const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        axios.post('http://localhost:8080/kachat/users/login', {
                "username": username.current.value,
                "password": password.current.value
            })
            .then( (result) => {
                setCurrentUser(result.data.data)
                navigate("/")
                console.log(result.data.data)
            })
            .catch( (error) => {
                setError(error.response.data.response_details.message);
                console.log(error.response.data.response_details.message)
            });


    }

    return (
        <div className='login_container'>
            <h1>WELCOME TO KACHAT!</h1>
            <Form className='login_form' onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control ref={username} type="text" placeholder="Enter username" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control ref={password} type="password" placeholder="Password" required/>
                </Form.Group>
                {error && 
                    <h6 style={{color: 'red'}}>{error}</h6>
                }
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