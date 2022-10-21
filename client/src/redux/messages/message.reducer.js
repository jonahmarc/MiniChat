import storage from 'redux-persist/lib/storage';
import { MessageActionTypes } from "./message.types";
const INITIAL_STATE = {
    currentMessage: null
};
const messageReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case MessageActionTypes.SET_CURRENT_MESSAGE:
            return{
                ...state,
                currentMessage: action.payload
            }
            case MessageActionTypes.DELETE_CURRENT_MESSAGE:
                storage.removeItem('persist:primary')
                return{
                    ...state,
                    currentMessage: null
                }
            default:
                return state;

    } 
};
export default messageReducer;