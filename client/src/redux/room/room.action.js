import { RoomActionTypes } from './room.types';

export const setCurrentRoom = room => ({
  type: RoomActionTypes.SET_ACTIVE_ROOM,
  payload: room
});

