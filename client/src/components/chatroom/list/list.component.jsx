import { useState, useEffect } from "react";

import { Button, ListGroup } from "react-bootstrap";

import "./list.component.scss";
import { connect } from "react-redux";
import { setCurrentRoom } from "../../../redux/room/room.action";

import { AppContext, stompClient } from "../../../context/appContext";
import ManageChatRoom from "../manage/manage.component";
import { useContext } from "react";
import { onMessageReceived } from "../messages/message-history.component";

const RoomsList = (props, { setCurrentRoom }) => {
  const { roomName, setRoomName } = useContext(AppContext);
  const [allChecked, setAllChecked] = useState(false);
  const [checked, setChecked] = useState(false);

  let check = allChecked;

  const [roomData, setRoomData] = useState([]);


  //*
  const onConnected = () => {
    //!stompClient.subscribe('/chatroom/'+props.roomName, onMessageReceived)
    stompClient.subscribe("/chatroom/" + props.roomName, onMessageReceived);
    //setRoomName(props.roomName)
  };
  
  useEffect(() => {
    fetch("http://localhost:8080/kachat/rooms/634d20e14173ec4c9fd9e402")
      .then((res) => res.json())
      .then((result) => {
        setRoomData(result.data.rooms_list);
      });
  }, []);
  const roomClicked = (e) => {
    console.log("clicked");
    console.log("roomName: ",e.target.innerText);
    // setCurrentRoom();
    // onConnected();
  };
  //*

  useEffect(() => {
    // console.log(allChecked);
  }, [allChecked]);

  useEffect(() => {
    // console.log(checked);
  }, [checked]);

  const handleAllChecked = (e) => {
    setAllChecked(!allChecked);
    if (check) {
      setChecked(true);
    }
  };

  const handleChecked = () => {
    setChecked(!checked);
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
          <i class="bi bi-trash3-fill"></i>
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
      <i class="bi bi-check-circle-fill text-success" variant="success"></i>
    );
  }
  return (
    <ListGroup className="rooms_list">
      {selectAll}
      {roomData.map((room) => (
        <ListGroup.Item
          action
          variant="light"
          key={room.id}
          className="d-grid gap-2 d-flex align-items-center justify-content-start"
          onClick={roomClicked}
        >
          {checkbox}
          {joined}
          <figure className="d-flex flex-column align-items-center m-0 p-0">
            <blockquote class="blockquote m-0 p-0">
              <h6>{room.name}</h6>
            </blockquote>
            <figcaption class="blockquote-footer m-0 p-0">
              {room.owner.display_name}
            </figcaption>
          </figure>
          <i className="ms-auto bi bi-lock-fill"></i>
          {/* <i class="bi bi-unlock"></i> */}
          {manage}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentRoom: (room) => dispatch(setCurrentRoom(room)),
});

export default connect(null, mapDispatchToProps)(RoomsList);
{
  /* <figure className="d-flex flex-column align-items-center m-0 p-0">
<blockquote class="blockquote m-0 p-0">
<h6>{room.name}</h6>
</blockquote>
<figcaption class="blockquote-footer m-0 p-0">
{room.owner.display_name}
</figcaption>
</figure>
<i className="ms-auto bi bi-lock-fill"></i>
<i class="bi bi-unlock"></i> */
}
