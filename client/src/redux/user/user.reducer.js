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
      return {
        ...state,
        currentUser: null
      }
    default:
      return state;
  }
};

export default userReducer;
