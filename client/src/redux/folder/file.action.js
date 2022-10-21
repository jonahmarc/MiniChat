import { FileActionTypes } from "./file.types";

export const setCurrentFile = file => ({
    type: FileActionTypes.SET_CURRENT_FILE,
    payload: file
})

export const fileSent = () => ({
    type: FileActionTypes.FILE_SENT
})