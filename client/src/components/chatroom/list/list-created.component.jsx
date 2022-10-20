import { useState, useEffect } from "react";

import { Button, ListGroup } from "react-bootstrap";

import axios from 'axios';

import ManageChatRoom from "../manage/manage.component";

import { connect } from "react-redux";
import { setCurrentRoom } from "../../../redux/room/room.action";

function RoomsListCreated ({ setCurrentRoom, currentUser, currentMenu}){

  const [roomData, setRoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      axios.get('http://localhost:8080/kachat/users/rooms/'+currentUser.user_id)
      .then( result => {
        setRoomData(result.data.data.created_rooms)
        console.log("rooms")
        console.log(result.data.data.created_rooms)
      }).catch( error => {
        console.log(error)
      })
      setIsLoading(false);
    }
    
  }, [isLoading, roomData]);

  const selectRoom = (room) => {
    // setCurrentRoom({...room, ["joined"]:true})
  }

  return (
    <>
    <ListGroup className="rooms_list">
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
          {
            roomData.map( (room, index) => (
              <ListGroup.Item
                key={index}
                action
                variant="light"
                className="d-grid gap-2 d-flex align-items-center justify-content-start"
                // onClick={ (e) => selectRoom(room)}
                >
                <input
                    className="form-check-input m-0"
                    type="checkbox"
                    id="checkboxNoLabel"
                    value=""
                />
                <figure className="d-flex flex-column align-items-center m-0 p-0 me-auto">
                    <blockquote class="blockquote m-0 p-0">
                    <h6>{room.name}</h6>
                    </blockquote>
                </figure>
                {room.private ? <i className="ms-auto bi bi-lock-fill"></i> : <i className="ms-auto bi bi-unlock"></i>}
                <ManageChatRoom type="UPDATE" {...room } />
              </ListGroup.Item>
            ))
          }
        </ListGroup>
    </>
  );
};

const mapStateToProps = ({user: {currentUser}, menu: {currentMenu}}) => ({
  currentUser,
  currentMenu

});

const mapDispatchToProps = (dispatch) => ({
  setCurrentRoom: (room) => dispatch(setCurrentRoom(room)),
});

export default connect(mapStateToProps,mapDispatchToProps)(RoomsListCreated);