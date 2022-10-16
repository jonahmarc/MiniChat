import { Stack, Button } from "react-bootstrap";

import './left.component.scss';

import { connect } from "react-redux";
import { logoutUser } from "../../redux/user/user.action";

import ManageChatRoom from "../chatroom/manage/manage.component";
import SearchRoom from "../chatroom/search/search.component";
import Menu from "./menu/menu.component";
import { useNavigate } from "react-router-dom";

const LeftComponent = ( { logoutUser } ) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
        console.log('logout');
    }

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
                <Button className="btn" variant="outline-primary" onClick={handleLogout}>
                <i class="bi bi-box-arrow-left">  LOGOUT</i></Button>
            </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    logoutUser: () => dispatch(logoutUser())
});

export default connect(null, mapDispatchToProps)(LeftComponent);