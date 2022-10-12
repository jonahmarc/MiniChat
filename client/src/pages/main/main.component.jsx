import { Stack } from "react-bootstrap";

import './main.component.scss';

import LeftComponent from "../../components/leftcomponent/left.component";
import Chat from "../../components/rightcomponent/chat/chat.component";

const Main = () => {
    return (
        <div className="main_container">
            <div className="chat_app">
                <LeftComponent className="left_container"/>
                <div className="vr"></div>
                <Chat className="right_container"/>
            </div>
        </div>
    );
}

export default Main;