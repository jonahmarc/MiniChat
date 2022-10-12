import { Stack, Form, Button } from "react-bootstrap";

import './chat.component.scss';

import Details from "../../chatroom/details/details.component";
import Messages from "../../chatroom/messages/message-history.component";

const Chat = () => {
    return (
        <Stack className="right_container m-0">
            <div className="chatroom_details d-flex align-items-center justify-content-between">
                <h4>Hangouts</h4>
                <Details />
            </div>
            <Messages className="messages" />
            <Form className='input d-grid gap-2 d-flex align-items-center justify-content-between'>
                <Button variant="light" type='file'><i class="bi bi-file-earmark"></i></Button>
                <Button variant="light" type=''><i class="bi bi-emoji-smile"></i></Button>
                {/* <Form.Group controlId="formBasicEmail" className="me-auto"> */}
                    <Form.Control className="me-auto" type="text" placeholder="Enter  Message"  />
                {/* </Form.Group> */}
                <Button variant="primary" type='submit'><i class="bi bi-send-fill"></i></Button>
            </Form>
        </Stack>
    );
}

export default Chat;