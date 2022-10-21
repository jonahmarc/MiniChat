import { MessageActionTypes } from "./message.types";

export const setCurrentMessage = message => ({
    type: MessageActionTypes.SET_CURRENT_MESSAGE,
    payload: message
});
export const deleteCurrentMessage = () => ({
    type: MessageActionTypes.DELETE_CURRENT_MESSAGE,
})