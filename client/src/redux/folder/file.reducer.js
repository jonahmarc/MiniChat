import { FileActionTypes } from "./file.types";
import storage from "redux-persist/lib/storage";

const INITIAL_STATE = {
    currentFile: null
}
const fileReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
    case FileActionTypes.SET_CURRENT_FILE:
        return {
            ...state,
            currentUser: action.payload
          };
        case FileActionTypes.FILE_SENT:
          console.log("File Sent")
          storage.removeItem('persist:primary')
          return {
            ...state,
            currentUser: null
          }
        default:
          return state;
      } 
};

export default fileReducer;