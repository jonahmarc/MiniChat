import axios from 'axios';
import { useEffect } from 'react';
import { useState, useRef } from 'react';

import { Form, Button, Toast } from 'react-bootstrap';
import makeToast from '../../toast/toaster';

import { connect } from 'react-redux';
import { setCurrentUser } from '../../../redux/user/user.action';

import './displayname.component.scss';

function Displayname({currentUser, setCurrentUser}) {

    const displayName = useRef();
    const [error, setError] = useState("");

    useEffect (() => {

    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(displayName.current.value)
        if (displayName != currentUser.displayName) {
            axios.put('http://localhost:8080/kachat/users/update/'+currentUser.user_id, {
                "display_name": displayName.current.value
            })
            .then( (result) => {
                setCurrentUser(
                    {...currentUser,["display_name"]: displayName.current.value}
                )
                makeToast("success", result.data.response_details.message)
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