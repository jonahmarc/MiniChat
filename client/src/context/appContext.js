import React from "react";
import {over} from 'stompjs'
import SockJS from "sockjs-client";
let Sock = new SockJS('http://localhost:8080/ws')
export let stompClient = over(Sock)
//stompClient.connect({})
export const WebSocketContext = React.createContext();

// // export default  ({children,currentRoom}) =>{
// //     let ws;
// //     const sendMessage = (roomId, message,userId) => {
       
// //         const chatMessage = {
// //             room: roomId,
// //             user: userId,
// //             status: "MESSAGE",
// //             content: message,
// //         }
// //         stompClient.send("/kachat/messages/"+roomId,{}, JSON.stringify(chatMessage))
// //     }
// //     const onMessageReceived = (payload) => {
// //         const payloadData = JSON.parse(payload.body)
// //         setCurrentMessage(payloadData.body.data)
// //         console.log(payload)
// //     }
// //     const onSubscribe = (roomId) => {
// //         console.log("ROOM ID", roomId)
// //         stompClient.subscribe("/chatroom/"+roomId,onMessageReceived())
// //     }
// //     ws = {
// //         sendMessage,
// //         onMessageReceived,
// //         onSubscribe,
// //     }
// //     return (
// //         <WebSocketContext.Provider value={ws}>
// //             {children}
// //         </WebSocketContext.Provider>
// //     )

// }