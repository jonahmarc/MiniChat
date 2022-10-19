import React from "react";
import {over} from 'stompjs'
import SockJS from "sockjs-client";
let Sock = new SockJS('http://localhost:8080/ws')
export let stompClient = over(Sock)
stompClient.connect({})
export const AppContext = React.createContext();