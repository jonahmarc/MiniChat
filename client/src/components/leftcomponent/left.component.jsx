import { Stack, Button } from "react-bootstrap";

import './left.component.scss';

import ManageChatRoom from "../chatroom/manage/manage.component";
import SearchRoom from "../chatroom/search/search.component";
import Menu from "./menu/menu.component";

const LeftComponent = () => {
    return (
        <div className="left_container">
            <Stack className="create_search m-0" gap={3} direction="horizontal">
                <ManageChatRoom type='CREATE'/>
                <div className="vr" />
                <SearchRoom />
            </Stack>
            <div className="menu">
                <Menu />
            </div>
            <div className="logout">
                <Button className="btn" variant="outline-primary">
                <i class="bi bi-box-arrow-left">  LOGOUT</i></Button>
            </div>
        </div>
    );
}

export default LeftComponent;