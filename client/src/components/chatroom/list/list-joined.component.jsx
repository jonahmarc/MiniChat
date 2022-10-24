import { useState, useEffect } from "react";

import { Button, ListGroup } from "react-bootstrap";

import axios from 'axios';

import { connect } from "react-redux";
import { setCurrentRoom } from "../../../redux/room/room.action";

function RoomsListJoined ({ setCurrentRoom, currentUser}){

  const [roomData, setRoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      axios.get('http://localhost:8080/kachat/rooms/joined/'+currentUser.user_id)
      .then( result => {
        setRoomData(result.data.data.joined_rooms)
        console.log('joined')
      }).catch( error => {
        console.log(error)
      })
      setIsLoading(false);
    }
    
  }, [isLoading, roomData]);

  const selectRoom = (room) => {
    setCurrentRoom(room)
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
                    {room.owner.username}
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