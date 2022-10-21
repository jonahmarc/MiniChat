import { WebSocketActionTypes } from "./webSocket.types";

export const onSubscribe = webSocket => ({
    type: WebSocketActionTypes.SUBSCRIBE,
    payload: webSocket
})