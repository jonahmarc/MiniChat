import { Stack } from "react-bootstrap";
import axios from "axios";
import "./message-history.component.scss";
import { connect } from "react-redux";
import { deleteCurrentMessage } from "../../../redux/messages/message.action";
import { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../../../context/appContext";

const Messages = ({
  currentRoom,
  currentUser,
  currentMessage,
  deleteCurrentMessage,
}) => {
  const [chat, setChat] = useState([]);
  const [chatHistory, setChatHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const {stompClient} = useContext(WebSocketContext)
  const messages = useRef();

  const scrollToBottom = () => {
    const scroll =
      messages.current.scrollHeight - messages.current.clientHeight;

    messages.current.scrollTo(0, scroll);
  };
  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    if (isLoading) {
      axios
        .get(
          "http://localhost:8080/kachat/rooms/history/" + currentRoom.room_id
        )
        .then((result) => {
           setChat(result.data.data.room_data.messages.reverse())
        })
        .catch((error) => {
          console.log(error);
        });
      setIsLoading(false);
    }
  }, [isLoading]);


  stompClient.connect({},function (frame){
    console.log('Connected',frame)
    setTimeout(function(){
      stompClient.subscribe("/chatroom/"+currentRoom.room_id, function (payload){
        const payloadData = JSON.parse(payload.body)
        const newChat =  payloadData.body.data
        console.log("MESSAGE: ", payloadData.body.data)

        console.log('CHAT HISTORY SA SOCKET: ', chatHistory)

        setChat(chat => {
          return [ ...chat, newChat]
        })

        console.log("CHAT SA SOCKET: ",chat)
      })
    },500)
  })
  
  console.log('CHAT: ', chat  )
  console.log('CHAT HISTORY:', chatHistory) 

 

  return (
    <div ref={messages}className="messages_history mt-2 p-0 d-flex flex-column">
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
