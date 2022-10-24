import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import roomReducer from './room/room.reducer';
import menuReducer from './menu/menu.reducer';
import fileReducer from './folder/file.reducer';
import messageReducer from './messages/message.reducer';

export default combineReducers({
    user: userReducer,
    room: roomReducer,
    menu: menuReducer,
    file: fileReducer,
    message: messageReducer
});
