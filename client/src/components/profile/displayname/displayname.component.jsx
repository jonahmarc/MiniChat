import axios from 'axios';
import { useEffect } from 'react';
import { useState, useRef } from 'react';

import { Form, Button, Toast } from 'react-bootstrap';

import { connect } from 'react-redux';
import { setCurrentUser } from '../../../redux/user/user.action';

import './displayname.component.scss';

function Displayname({currentUser, setCurrentUser}) {

    const displayName = useRef();

    const [show, setShow] = useState(false);
    const [error, setError] = useState("");

    useEffect (() => {

    }, [show, error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(displayName.current.value)
        if (displayName != currentUser.displayName) {
            axios.put('http://localhost:8080/kachat/users/update/'+currentUser.user_id, {
                "display_name": displayName.current.value
            })
            .then( (result) => {
                setShow(true)
                setCurrentUser(
                    {...currentUser,["display_name"]: displayName.current.value}
                )
                window.location.reload(false)
            }).catch( (error) => {
                setError(error.message)
            })
        }
    }

    return (
        <>
            <Form className="mb-3 ps-5 pe-5 d-flex flex-column align-item-center justify-content-center" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" >
                    <Form.Control 
                        ref={displayName}
                        type="text" placeholder="Enter Display Name" 
                        defaultValue={currentUser.display_name} required/>
                </Form.Group>
                {   error && 
                        <h6 style={{color: 'red'}}>{error}</h6>
                }
                <Button className="ml-5" type="submit" variant="primary">
                    UPDATE
                </Button>
            </Form>
            <Toast className='position-absolute bottom-0 start-0 mb-3 ms-3' 
            bg='success' onClose={() => setShow(false)} show={show} 
            delay={6000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>Display Name updated successfully!</Toast.Body>
            </Toast>
        </>
    );

}

const mapStateToProps = ({user}) => ({
    currentUser: user.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Displayname);