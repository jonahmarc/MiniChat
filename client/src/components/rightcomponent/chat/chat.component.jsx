import React, { useState, Suspense } from "react";
import { Stack, Form, Button } from "react-bootstrap";
import Picker from "emoji-picker-react";
import EmojiPicker from "emoji-picker-react";

import "./chat.component.scss";

import Details from "../../chatroom/details/details.component";
import Messages from "../../chatroom/messages/message-history.component";
import UploadFile from "../../chatroom/uploadfile/button-uploadfile.componenet";
import { useContext } from "react";
import { AppContext } from "../../../context/appContext";

const Chat = () => {
  const {stompClient} = useContext(AppContext)
  const [userData, setUserData] = useState({
    username: "Prince",
    receiverName: "Mervin",
    connected: false,
    message: "",
  });

  const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);

  const [input, setInput] = useState("");

  const onEmojiClick = (event, emojiObject) => {
    setInput(input + event.emoji);
  };

  const handleInput = (e) => {
    if (e.nativeEvent.data != null) {
      setInput(input + e.nativeEvent.data);
    } else {
      setInput(input.slice(0, -1));
    }
    console.log(e);
    console.log(input);
  };

  //*
  const onSubmit = () => {
    //! code for sending a msg, get the current roomName via redux 
    // if(stompClient){
    //     const chatMessage = {
    //         senderName: userData.username,
    //         receiverName: userData.receiverName,
    //         message: userData.message,
    //         status: "MESSAGE",
    //     }
    //     stompClient.send("/kachat/messages"+ roomName, {}, JSON.stringify(chatMessage))
    }
  

  //*

  return (
    <Stack className="right_container m-0">
      <div className="chatroom_details d-flex align-items-center justify-content-between">
        <h4>
          <strong>Hangouts</strong>
        </h4>
        <Details />
      </div>
      <Messages className="messages" />

      <div className="input d-grid gap-2 d-flex align-items-center justify-content-start">
        <UploadFile />
        <Button variant="light" type="" onClick={togglePicker}>
          <i class="bi bi-emoji-smile"></i>
        </Button>
        {pickerOpen && (
          <Suspense fallback={<p id="loading">loading</p>}>
            <div className="emoji_picker">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          </Suspense>
        )}
        <Form className="d-grid gap-2 d-flex align-items-center justify-content-between flex-fill">
          <Form.Control
            className="me-auto"
            type="text"
            onChange={handleInput}
            value={input}
            placeholder="Enter  Message"
          />
          <Button variant="primary" type="submit" onClick={onSubmit} >
            <i class="bi bi-send-fill"></i>
          </Button>
          {/* <Button variant="light" type='file'><i class="bi bi-file-earmark"></i></Button> */}
          {/* <Form.Group controlId="formBasicEmail" className="me-auto"> */}
          {/* </Form.Group> */}
        </Form>
      </div>
    </Stack>
  );
};

export default Chat;
