import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RoomAvailable } from "colyseus.js";

interface RoomInterface extends RoomAvailable {
  name: string;
}

const isCustomRoom = (room: RoomInterface) => {
  return room.name === "custom";
};

export const roomStore = createSlice({
  name: "room",
  initialState: {
    lobbyJoined: false,
    roomJoined: false,
    roomId: "",
    roomName: "",
    roomDescription: "",
    availableRooms: new Array<RoomAvailable>(),
  },
  reducers: {
    setLobbyJoined: (state, action: PayloadAction<boolean>) => {
      state.lobbyJoined = action.payload;
    },
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload;
    },
    setJoinedRoomData: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string }>
    ) => {
      state.roomId = action.payload.id;
      state.roomName = action.payload.name;
      state.roomDescription = action.payload.description;
    },
    setAvailableRooms: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms = action.payload.filter((room) =>
        isCustomRoom(room)
      );
    },
    addAvailableRooms: (
      state,
      action: PayloadAction<{ roomId: string; room: RoomAvailable }>
    ) => {
      if (!isCustomRoom(action.payload.room)) return;
      const roomIndex = state.availableRooms.findIndex(
        (room) => room.roomId === action.payload.roomId
      );
      if (roomIndex !== -1) {
        state.availableRooms[roomIndex] = action.payload.room;
      } else {
        state.availableRooms.push(action.payload.room);
      }
    },
    removeAvailableRooms: (state, action: PayloadAction<string>) => {
      state.availableRooms = state.availableRooms.filter(
        (room) => room.roomId !== action.payload
      );
    },
  },
});

export const {
  setLobbyJoined,
  setRoomJoined,
  setJoinedRoomData,
  setAvailableRooms,
  addAvailableRooms,
  removeAvailableRooms,
} = roomStore.actions;

export default roomStore.reducer;
