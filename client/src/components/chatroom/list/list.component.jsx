import { useState, useEffect } from "react";

import { Button, ListGroup } from "react-bootstrap";

import axios from 'axios';

import "./list.component.scss";
import { connect } from "react-redux";
import { setCurrentRoom } from "../../../redux/room/room.action";

// import { AppContext, stompClient } from "../../../context/appContext";
import ManageChatRoom from "../manage/manage.component";
import { useContext } from "react";
import { onMessageReceived } from "../messages/message-history.component";

const RoomsList = (props,{ setCurrentRoom }) => {
  // const { roomName, setRoomName } = useContext(AppContext);

  const [roomData, setRoomData] = useState([]);
  useEffect(() => {
    getRooms();
    console.log('useeffect')
  }, []);

  let dummyData;
  async function getRooms() {
    dummyData = await axios.get('https://jsonplaceholder.typicode.com/users');
    dummyData = dummyData.data;
        console.log(dummyData);
    // try {
    //   dummyData = await axios.get("https://dummyjson.com/users");
    //   console.log(dummyData);
    // }
    // catch (error) {
    //   console.log(error);
    // }
  }

  const rooms = dummyData?.map( (room) =>
              <p key={room.id} >{room.name}</p>
            );

  //*
  const onConnected = () => {
    //!stompClient.subscribe('/chatroom/'+props.roomName, onMessageReceived)
    // stompClient.subscribe("/chatroom/"+props.roomName, onMessageReceived);
    //setRoomName(props.roomName)
  };

  const roomClicked = (e) => {
    console.log("clicked");
    console.log("roomName: ");
    setCurrentRoom(e);
    onConnected();
  };

  let selectAll;
  let checkbox;
  let joined;
  let manage;

  if (props.type == "profile") {
    selectAll = (
      <ListGroup.Item
        action
        variant="light"
        className="d-grid gap-2 d-flex align-items-center justify-content-start sticky-top"
      >
        <input
          className="form-check-input m-0"
          type="checkbox"
          id="checkboxNoLabel"
          value=""
        />
        <h6 className="mb-0 me-auto">Select All</h6>
        <Button variant="danger">
          <i className="bi bi-trash3-fill"></i>
        </Button>
      </ListGroup.Item>
    );
    checkbox = (
      <input
        className="form-check-input m-0"
        type="checkbox"
        id="checkboxNoLabel"
        value=""
      />
    );
    manage = <ManageChatRoom type="MANAGE" />;
  } else {
    joined = (
      <i className="bi bi-check-circle-fill text-success" variant="success"></i>
    );
  }

  return (
    <>
        <ListGroup className="rooms_list">
                {selectAll}
                {rooms}
        </ListGroup>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentRoom: (room) => dispatch(setCurrentRoom(room)),
});

export default connect(null, mapDispatchToProps)(RoomsList);


// {roomData.map((room) => {
//   <ListGroup.Item
//   action
//   variant="light"
//   className="d-grid gap-2 d-flex align-items-center justify-content-start"
//   onClick={roomClicked}
//   >
//   {checkbox}
//   {joined}
//   <figure className="d-flex flex-column align-items-center m-0 p-0">
//       <blockquote class="blockquote m-0 p-0">
//       <h6>{room.name}</h6>
//       </blockquote>
//       <figcaption class="blockquote-footer m-0 p-0">
//       {room.owner.display_owner}
//       </figcaption>
//   </figure>
//   <i className="ms-auto bi bi-lock-fill"></i>
//   {/* <i class="bi bi-unlock"></i> */}
//   {manage}
//   </ListGroup.Item>
// })}