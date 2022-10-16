import storage from 'redux-persist/lib/storage';
import { UserActionTypes } from './user.types';

const INITIAL_STATE = {
  currentUser: null
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    case UserActionTypes.LOGOUT_USER:
      console.log("logoutUser")
      storage.removeItem('persist:main-root')
      return {
        ...state,
        currentUser: null
      }
    default:
      return state;
  }
};

export default userReducer;
