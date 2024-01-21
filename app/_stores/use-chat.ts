import { IChatting } from "@/types/N1Building";
import { create } from "zustand";
import phaserGame from "../PhaserGame";

export enum MessageType {
  PLAYER_JOINED,
  PLAYER_LEFT,
  NORMAL_MESSAGE,
}

interface ChatStore {
  chatMessages: { messageType: MessageType; chatMessage: IChatting }[];
  focused: boolean;
  showChat: boolean;
  pushChatMessage: (chat: IChatting) => void;
  pushPlayerJoinedMessage: (username: string) => void;
  pushPlayerLeftMessage: (username: string) => void;
  setFocused: (isFocused: boolean) => void;
  setShowChat: (show: boolean) => void;
}

export const useChat = create<ChatStore>((set) => ({
  chatMessages: new Array<{
    messageType: MessageType;
    chatMessage: IChatting;
  }>(),
  focused: false,
  showChat: true,
  pushChatMessage: (chat: IChatting) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { messageType: MessageType.NORMAL_MESSAGE, chatMessage: chat },
      ],
    })),
  pushPlayerJoinedMessage: (username: string) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          messageType: MessageType.PLAYER_JOINED,
          chatMessage: {
            messageSentTime: new Date().getTime(),
            user: username,
            content: "joined the lobby",
          } as IChatting,
        },
      ],
    })),
  pushPlayerLeftMessage: (username: string) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          messageType: MessageType.PLAYER_JOINED,
          chatMessage: {
            messageSentTime: new Date().getTime(),
            user: username,
            content: "joined the lobby",
          } as IChatting,
        },
      ],
    })),
  setFocused: (isFocused: boolean) =>
    set((state) => {
      const game = phaserGame.scene.keys.game as Game;
      isFocused ? game.disableKeys() : game.enableKeys();

      return { focused: isFocused };
    }),
  setShowChat: (show: boolean) => set(() => ({ showChat: show })),
}));