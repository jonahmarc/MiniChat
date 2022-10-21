import { Stack, Button } from "react-bootstrap";

import './left.component.scss';

import { connect } from "react-redux";
import { logoutUser } from "../../redux/user/user.action";
import ManageChatRoom from "../chatroom/manage/manage.component";
import SearchRoom from "../chatroom/search/search.component";
import Menu from "./menu/menu.component";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LeftComponent ( { logoutUser, currentUser } ) {

    const navigate = useNavigate();

    const handleLogout = () => {
        axios.put('http://localhost:8080/kachat/users/logout/'+currentUser.user_id)
        .then((result) => {
            console.log(result.message)
        }).catch((error) => {
            console.log(error)
            alert(error.message)
        })
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
                <i className="bi bi-box-arrow-left">  LOGOUT</i></Button>
            </div>
        </div>
    );
}

const mapStateToProps = ({user}) => ({
    currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
    logoutUser: () => dispatch(logoutUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftComponent);