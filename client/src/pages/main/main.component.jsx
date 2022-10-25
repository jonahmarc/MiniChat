import './main.component.scss';

import LeftComponent from "../../components/leftcomponent/left.component";
import Chat from "../../components/rightcomponent/chat/chat.component";
import WelcomeComponent from '../../components/rightcomponent/welcome/welcome.component';

import { connect } from "react-redux";

function Main({ currentRoom }) {
    console.log("CURRENT ROOM: " , currentRoom)
    
    return (
        <div className="main_container">
            <div className="chat_app">
                <LeftComponent className="left_container"/>
                <div className="vr"></div>
                {
                    currentRoom ? <Chat className="right_container"/> :
                                <WelcomeComponent  className="right_container" />
                }
               
                
            </div>
        </div>
    );
}


const mapStateToProps = ({room}) => ({
    currentRoom: room.currentRoom
  });

export default connect(mapStateToProps)(Main);