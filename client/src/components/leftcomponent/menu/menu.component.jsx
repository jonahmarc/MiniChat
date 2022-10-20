import { Tab, Tabs } from 'react-bootstrap';

import RoomsListJoined from '../../chatroom/list/list-joined.component';
import RoomsListAll from '../../chatroom/list/list-all.component';
import RoomsListCreated from '../../chatroom/list/list-created.component';

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
        <RoomsListJoined type="joined/" />
      </Tab>
      <Tab eventKey="listrooms" title="Rooms" >
       <RoomsListAll type=""/>
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <Displayname />
        <RoomsListCreated type='profile/' />
      </Tab>
    </Tabs>
  );
}


export default Menu;