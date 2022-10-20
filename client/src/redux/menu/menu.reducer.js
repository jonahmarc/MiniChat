import storage from 'redux-persist/lib/storage';
import { MenuActionTypes } from './menu.types';

const INITIAL_STATE = {
  currentMenu: 'joined'
};

const menuReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MenuActionTypes.SET_ACTIVE_MENU:
      return {
        ...state,
        currentMenu: action.payload
      }
    default:
      return state;
  }
};

export default menuReducer;
