import storage from 'redux-persist/lib/storage';
import { RoomActionTypes } from './room.types';

const INITIAL_STATE = {
  currentRoom: null
};

const roomReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RoomActionTypes.SET_ACTIVE_ROOM:
      return {
        ...state,
        currentRoom: action.payload
      }
    default:
      return state;
  }
};

export default roomReducer;
