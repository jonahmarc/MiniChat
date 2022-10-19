import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import roomReducer from './room/room.reducer';

export default combineReducers({
    user: userReducer,
    room:roomReducer
});
