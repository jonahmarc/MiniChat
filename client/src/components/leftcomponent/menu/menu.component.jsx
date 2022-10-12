import { Tab, Tabs } from 'react-bootstrap';
import RoomsList from '../../chatroom/list/list.component';
import Displayname from '../../profile/displayname/displayname.component';

import './menu.component.scss';

const Menu = () => {
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
      <Tab eventKey="listrooms" title="List Rooms">
        <RoomsList />
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <Displayname />
        <RoomsList type='profile' />
      </Tab>
    </Tabs>
  );
}

export default Menu;