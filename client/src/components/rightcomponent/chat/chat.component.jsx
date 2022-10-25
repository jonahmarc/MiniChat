import React, { useState, Suspense, useEffect, useRef } from "react";
import { Stack, Form, Button } from "react-bootstrap";
import EmojiPicker from "emoji-picker-react";

import "./chat.component.scss";

import { connect } from "react-redux";

import Details from "../../chatroom/details/details.component";
import Messages from "../../chatroom/messages/message-history.component";
import UploadFile from "../../chatroom/uploadfile/button-uploadfile.componenet";
import { useContext } from "react";
import { WebSocketContext } from "../../../context/appContext";

function Chat({ currentRoom, currentUser }) {
  
  const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null)
  const { stompClient } = useContext(WebSocketContext);

  function scrollToBottom(){
    messageEndRef.current?.scrollIntoView({behavior: "smooth"})
  }
 


  const onEmojiClick = (event, emojiObject) => {
    setInput(input + event.emoji);
  };

  const handleInput = (e) => {
    if (e.nativeEvent.data != null) {
      setInput(input + e.nativeEvent.data);
    } else {
      setInput(input.slice(0, -1));
    }
  };

  const onSubmit = (e) => {
    //! make sure this wont send unless its subscribed
    e.preventDefault(); 
    if (stompClient) {
       if(input !== ''){const chatMessage = {
        room: currentRoom.room_id,
        user: currentUser.user_id,
        status: "MESSAGE",
        content: input,
      };
      stompClient.send("/kachat/messages/" + currentRoom.room_id,{},JSON.stringify(chatMessage));
      setInput("")}
   }
    scrollToBottom()

  };

  return (
    <Stack className="right_container m-0 gap-2">
      <div className="chatroom_details d-flex align-items-center justify-content-between">
        <h4>
          <strong>{currentRoom.name}</strong>
        </h4>
        <Details />
      </div>
      <Messages className="messages"/>
      <div ref={messageEndRef} />
      <div className="input d-grid gap-2 d-flex align-items-center justify-content-start">
        <UploadFile />
        <Button variant="light" type="" onClick={togglePicker}>
          <i className="bi bi-emoji-smile"></i>
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
          <Button variant="primary" type="submit" onClick={onSubmit}>
            <i className="bi bi-send-fill"></i>
          </Button>
        </Form>
      </div>
    </Stack>
  );
}

const mapStateToProps = ({ user, room }) => ({
  currentUser: user.currentUser,
  currentRoom: room.currentRoom,
});

export default connect(mapStateToProps)(Chat);
