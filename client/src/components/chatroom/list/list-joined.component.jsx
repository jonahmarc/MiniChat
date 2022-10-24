import { useState, useEffect, useContext } from "react";

import { Button, ListGroup } from "react-bootstrap";

import axios from 'axios';

import { connect } from "react-redux";
import { setCurrentRoom } from "../../../redux/room/room.action";
import { WebSocketContext} from "../../../context/appContext";
import { setCurrentMessage } from "../../../redux/messages/message.action";


function RoomsListJoined ({ setCurrentRoom, currentUser,setCurrentMessage}){
  const [roomData, setRoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {stompClient} = useContext(WebSocketContext)

  useEffect(() => {
    if (isLoading) {
      axios.get('http://localhost:8080/kachat/rooms/joined/'+currentUser.user_id)
      .then( result => {
        setRoomData(result.data.data.joined_rooms)
      console.log("JOINED ROOMS: ",result.data.data.joined_rooms)
      }).catch( error => {
        console.log(error)
      })
      setIsLoading(false);
    }
  }, [isLoading, roomData]);
  
  const onMessageReceived = (payload) => {
    // console.log(payload)
    // const payloadData = JSON.parse(payload.body)
    // console.log(payloadData)
    // const payloadData = JSON.parse(payload.body)
    // setCurrentMessage(payloadData.body.data)
  //  const payloadData = JSON.parse(payload.body)
  //   console.log("MESSAGE: ",payloadData.body.data)
   //setCurrentMessage(payloadData.body.data)
    
  }

  // const onSubscribe = (roomId) => {
  //   stompClient.subscribe("/chatroom/"+roomId,onMessageReceived())
  // }

  const selectRoom = (room) => {
    setCurrentRoom(room)
    console.log(room.room_id)
    window.location.reload()

   // onSubscribe(room.room_id)
    

    
  }

  return (
    <>
    <ListGroup className="rooms_list">
          {
            roomData.map( (room) => (
              <ListGroup.Item
                action
                variant="light"
                className="d-grid gap-2 d-flex align-items-center justify-content-start"
                onClick={ (e) => selectRoom(room)}
                >
                <i className="bi bi-check-circle-fill text-success" variant="success"></i>
                <figure className="d-flex flex-column align-items-center m-0 p-0">
                    <blockquote class="blockquote m-0 p-0">
                    <h6>{room.name}</h6>
                    </blockquote>
                    <figcaption class="blockquote-footer m-0 p-0">
                    {room.owner.display_name}
                    </figcaption>
                </figure>
                {room.locked ? <i className="ms-auto bi bi-lock-fill"></i> : <i class="ms-auto bi bi-unlock"></i>}
              </ListGroup.Item>
            ))
          }
        </ListGroup>
    </>
  );
};

const mapStateToProps = ({user: {currentUser}}) => ({
  currentUser

});

const mapDispatchToProps = (dispatch) => ({
  setCurrentRoom: (room) => dispatch(setCurrentRoom(room)),
  
});

export default connect(mapStateToProps,mapDispatchToProps)(RoomsListJoined);