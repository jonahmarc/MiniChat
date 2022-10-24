import { stompClient } from "../../context/appContext"
import { WebSocketActionTypes } from "./webSocket.types"


const INITIAL_STATE = {
    currenSubscription:null
    
}
// const webSocketReducer = (state = INITIAL_STATE, action) => {
//     switch(action.type){
//         case WebSocketActionTypes.SUBSCRIBE:
//             return {
//                 ...state,
//                 currenSubscription: stompClient.subscribe("/chatroom/"+ action.payload, function (payload){
//                     const payloadData = 
//                 })
//             }
//     }
// }