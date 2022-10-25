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
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { stompClient } = useContext(WebSocketContext);
  const messages = useRef();

  const scrollToBottom = () => {
    const scroll =
      messages.current.scrollHeight - messages.current.clientHeight;

    messages.current.scrollTo(0, scroll);
  };
  useEffect(() => {
    scrollToBottom();
  });

  const dateFormatter = (payload) => {
    const date = new Date(payload.sent_at);
    let formattedDate = date.toLocaleDateString("en-US", {
      timeZone: "Asia/Manila",
      hour12: false,
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    payload.sent_at = formattedDate;
    return payload;
  };

  useEffect(() => {
    if (isLoading) {
      axios
        .get(
          "http://localhost:8080/kachat/rooms/history/" + currentRoom.room_id
        )
        .then((result) => {
          const chatHist = result.data.data.room_data.messages.reverse();
          chatHist.map((chat) => {
            return dateFormatter(chat);
          });
          setChat(chatHist);
        })
        .catch((error) => {
          console.log(error);
        });
      setIsLoading(false);
    }
  }, [isLoading]);

  stompClient.connect({}, function (frame) {
    console.log("Connected", frame);
    setTimeout(function () {
      stompClient.subscribe(
        "/chatroom/" + currentRoom.room_id,
        function (payload) {
          const payloadData = JSON.parse(payload.body);

          const newChat = dateFormatter(payloadData.body.data);
          console.log("MESSAGE: ", payloadData.body.data.sent_at);

          setChat((chat) => {
            return [...chat, newChat];
          });

          console.log("CHAT SA SOCKET: ", chat);
        }
      );
    }, 500);
  });

  console.log("CHAT: ", chat);

  return (
    <div
      ref={messages}
      className="messages_history mt-2 p-0 d-flex flex-column"
    >
      {chat.map((msg, index) => (
        <div
          className={
            msg.user.display_name === currentUser.display_name
              ? "sent align-self-end me-2 mb-3 p-2"
              : "received align-self-start ms-2 mb-3 p-2"
          }
        >
          <p className="mb-0 p-0 fs-6 fw-lighter" key={index}>
            <em
              className="name m-0 p-0"
              style={{
                color:
                  msg.user.display_name === currentUser.display_name
                    ? "#D5DBDB"
                    : "#5D6D7E",
                fontSize: 12,
              }}
            >
              {msg.user.display_name}
            </em>
          </p>
          <p className="content m-0 p-0">{msg.content}</p>
          <p className="mb-0 p-0 fs-6 fw-lighter">
            <em
              style={{
                color:
                  msg.user.display_name === currentUser.display_name
                    ? "#D5DBDB"
                    : "#5D6D7E",
                fontSize: 8,
              }}
            >
              {msg.sent_at}
            </em>
          </p>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = ({ user, room, message }) => ({
  currentUser: user.currentUser,
  currentRoom: room.currentRoom,
  currentMessage: message.currentMessage,
});
const mapDispatchToProps = (dispatch) => ({
  deleteCurrentMessage: () => dispatch(deleteCurrentMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
