"use client";

import { IChatting } from "@/types/N1Building";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import phaserGame from "../PhaserGame";
import Game from "../_scenes/Game";

export enum MessageType {
  PLAYER_JOINED,
  PLAYER_LEFT,
  NORMAL_MESSAGE,
}

interface ChatStore {
  chatMessages: { messageType: MessageType; chatMessage: IChatting }[];
  focused: boolean;
  showChat: boolean;
}

const initialState: ChatStore = {
  chatMessages: new Array<{
    messageType: MessageType;
    chatMessage: IChatting;
  }>(),
  focused: false,
  showChat: true,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    pushChatMessage: (state, action: PayloadAction<IChatting>) => {
      state.chatMessages.push({
        messageType: MessageType.NORMAL_MESSAGE,
        chatMessage: action.payload,
      });
    },
    pushPlayerJoinedMessage: (state, action: PayloadAction<string>) => {
      state.chatMessages.push({
        messageType: MessageType.PLAYER_JOINED,
        chatMessage: {
          messageSentTime: new Date().getTime(),
          user: action.payload,
          content: "joined the lobby",
        } as IChatting,
      });
    },
    pushPlayerLeftMessage: (state, action: PayloadAction<string>) => {
      state.chatMessages.push({
        messageType: MessageType.PLAYER_LEFT,
        chatMessage: {
          messageSentTime: new Date().getTime(),
          user: action.payload,
          content: "left the lobby",
        } as IChatting,
      });
    },
    setFocused: (state, action: PayloadAction<boolean>) => {
      const game = phaserGame.scene.keys.game as Game;
      action.payload ? game.disableKeys() : game.enableKeys();
      state.focused = action.payload;
    },
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload;
    },
  },
});

export const {
  pushChatMessage,
  pushPlayerJoinedMessage,
  pushPlayerLeftMessage,
  setFocused,
  setShowChat,
} = chatSlice.actions;

export default chatSlice.reducer;
