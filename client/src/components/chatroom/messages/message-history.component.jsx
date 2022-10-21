import { Stack } from "react-bootstrap";
import axios from "axios";
import "./message-history.component.scss";
import { connect } from "react-redux";
import { deleteCurrentMessage } from "../../../redux/messages/message.action";
import { useContext, useEffect, useRef, useState } from "react";

<<<<<<< HEAD
const Messages = ({
  currentRoom,
  currentUser,
  currentMessage,
  deleteCurrentMessage,
}) => {
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
 
  useEffect(() => {
    if (isLoading) {
      axios.get('http://localhost:8080/kachat/rooms/history/'+currentRoom.room_id)
      .then( result => {
        console.log(result.data)
        setChat((result.data.data.room_data.messages).reverse())
      }).catch( error => {
        console.log(error)
      })
      setIsLoading(false);
    }
    
  }, [isLoading]);

  useEffect(() => {
    chat.push(currentMessage);
    setChat([...chat]);
    // deleteCurrentMessage()
    console.log(chat);
  }, [currentMessage]);
  
  console.log("CHAT: ", chat)
  console.log("CURRENT MESSAGE: ",currentMessage);
  console.log("CURRENT USER: ",currentUser.display_name);
=======
import { useEffect, useRef } from 'react';

import './message-history.component.scss';
>>>>>>> 78db488bf13c7fc5ed3620171334eedd4bf52266

  

<<<<<<< HEAD
  return (
    <div className="messages_history mt-2 p-0 d-flex flex-column">
      {chat.map((msg, index) => (
        <div
          className={
            msg.user.display_name === currentUser.display_name
              ? "sent align-self-end me-2 mb-3 p-2"
              : "received align-self-start ms-2 mb-3 p-2"
          }
        >
          <p className="m-0 p-0 fs-6 fw-lighter" key={index}>
            <em>{msg.user.display_name}</em>
          </p>
          <p className="m-0 p-0 fs-6 fw-lighter">
            <em>{msg.sent_at}</em>
          </p>
          <p className="m-0 p-0">{msg.content}</p>
=======
//! display the messages to the DOM
export const onMessageReceived = (payload) =>{
    const payloadData = JSON.parse(payload.body)
    console.log("MESSAGE: ", payloadData )
    data.push(payloadData)
}

const Messages = () => {

    const messages = useRef();

    const scrollToBottom = () => {
        const scroll =
        messages.current.scrollHeight -
        messages.current.clientHeight;
        messages.current.scrollTo(0, scroll);
    };

    useEffect (() => {
        scrollToBottom()
    });

    return (
        <div ref={messages} className='messages_history mt-2 p-0 d-flex flex-column'>
            <div className="received align-self-start ms-2 mb-3 p-2">
                <p className='m-0 p-0 fs-6 fw-lighter'><em>iandave</em></p>
                <p className='m-0 p-0 fs-6 fw-lighter'><em>10/12/22 17:37</em></p>
                <p className='m-0 p-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Repellat quasi dicta repudiandae velit excepturi! 
                    Beatae vel excepturi ipsum odio assumenda facere ipsa unde dolore consequatur fugiat. 
                    Maxime nobis adipisci dicta.
                </p>
            </div>
            <div className="sent align-self-end me-2 mb-3 p-2">
                <p className='m-0 p-0 fs-6 fw-lighter'><em>10/12/22 18:13</em></p>
                <p className='m-0 p-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Repellat quasi dicta repudiandae velit excepturi! 
                    Beatae vel excepturi ipsum odio assumenda facere ipsa unde dolore consequatur fugiat. 
                    Maxime nobis adipisci dicta.
                </p>
            </div>
            <div className="received align-self-start ms-2 mb-3 p-2">
                <p className='m-0 p-0 fs-6 fw-lighter'><em>iandave</em></p>
                <p className='m-0 p-0 fs-6 fw-lighter'><em>10/12/22 17:37</em></p>
                <p className='m-0 p-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Repellat quasi dicta repudiandae velit excepturi! 
                    Beatae vel excepturi ipsum odio assumenda facere ipsa unde dolore consequatur fugiat. 
                    Maxime nobis adipisci dicta.
                </p>
            </div>
            <div className="sent align-self-end me-2 mb-3 p-2">
                <p className='m-0 p-0 fs-6 fw-lighter'><em>10/12/22 18:13</em></p>
                <p className='m-0 p-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Repellat quasi dicta repudiandae velit excepturi! 
                    Beatae vel excepturi ipsum odio assumenda facere ipsa unde dolore consequatur fugiat. 
                    Maxime nobis adipisci dicta.
                </p>
            </div>
            <div className="received align-self-start ms-2 mb-3 p-2">
                <p className='m-0 p-0 fs-6 fw-lighter'><em>iandave</em></p>
                <p className='m-0 p-0 fs-6 fw-lighter'><em>10/12/22 17:37</em></p>
                <p className='m-0 p-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Repellat quasi dicta repudiandae velit excepturi! 
                    Beatae vel excepturi ipsum odio assumenda facere ipsa unde dolore consequatur fugiat. 
                    Maxime nobis adipisci dicta.
                </p>
            </div>
            <div className="sent align-self-end me-2 mb-3 p-2">
                <p className='m-0 p-0 fs-6 fw-lighter'><em>10/12/22 18:13</em></p>
                <p className='m-0 p-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Repellat quasi dicta repudiandae velit excepturi! 
                    Beatae vel excepturi ipsum odio assumenda facere ipsa unde dolore consequatur fugiat. 
                    Maxime nobis adipisci dicta.
                </p>
            </div>
>>>>>>> 78db488bf13c7fc5ed3620171334eedd4bf52266
        </div>
      ))}
    </div>
  );
};

//! LEFT

const mapStateToProps = ({ user, room, message }) => ({
  currentUser: user.currentUser,
  currentRoom: room.currentRoom,
  currentMessage: message.currentMessage,
});
const mapDispatchToProps = (dispatch) => ({
  deleteCurrentMessage: () => dispatch(deleteCurrentMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

{
  /* {chat.map((msg) =>
        msgBox ? (
          <div className="sent align-self-end me-2 mb-3 p-2">
            <p className="m-0 p-0 fs-6 fw-lighter">
              <em>{msg.username}</em>
            </p>
            <p className="m-0 p-0 fs-6 fw-lighter">
              <em>{msg.sent_at}</em>
            </p>
            <p className="m-0 p-0">{msg.content}</p>
          </div>
        ) : (
          <div className="received align-self-start ms-2 mb-3 p-2">
            <p className="m-0 p-0 fs-6 fw-lighter">
              <em>{msg.username}</em>
            </p>
            <p className="m-0 p-0 fs-6 fw-lighter">
              <em>{msg.sent_at}</em>
            </p>
            <p className="m-0 p-0">{msg.content}</p>
          </div>
        )
      )} */
}
