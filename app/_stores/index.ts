"use client";

import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import chatReducer from "./ChatStore";
import userReducer from "./UserStore";
import roomReducer from "./RoomStore";
import computerReducer from "./ComputerStore";
import whiteboardReducer from "./WhiteboardStore";

enableMapSet(); //상태를 변경하는 동안 불변성을 지켜줌

//configureStore: redux store 생성
const store = configureStore({
  reducer: {
    user: userReducer,
    computer: computerReducer,
    whiteboard: whiteboardReducer,
    chat: chatReducer,
    room: roomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

//infer type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
