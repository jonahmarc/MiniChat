import { useState, useEffect } from "react";
import { Tab, Tabs } from 'react-bootstrap';
import RoomsList from '../../chatroom/list/list.component';
import Displayname from '../../profile/displayname/displayname.component';

import './menu.component.scss';

const Menu = () => {
  //  useEffect(() => {
  //   fetch("http://localhost:8081/kachat/rooms/6344bdc8238f801b0124710d")
  //   .then((res) => res.json())
  //   .then((result) => {
  //     setRoomData(result.data.rooms_list);
  //   });
  // }, []);

  return (
    <Tabs
      defaultActiveKey="joined"
      id="justify-tab-example"
      className="menu_tab mb-3 sticky-top"
      justify
    >
      <Tab eventKey="joined" title="Joined" className='joined'>
        <RoomsList />
      </Tab>
      <Tab eventKey="listrooms" title="Rooms">
     {/*  { roomData.map(room => {
       return  <RoomsList roomName={room.name} creator={room.owner.display_name} />
       }) } */}
       <RoomsList/>
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <Displayname />
        <RoomsList type='profile' />
      </Tab>
    </Tabs>
  );
}

export default Menu;