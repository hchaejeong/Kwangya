import { create } from "zustand";
import phaserGame from "../PhaserGame";
import Game from "../_scenes/Game";

interface WhiteboardStore {
  whiteboardDialogOpen: boolean;
  whiteboardId: null | string;
  whiteboardUrl: null | string;
  urls: Map<string, string>;
  openWhiteboardDialog: (id: string) => void;
  closeWhiteboardDialog: () => void;
  setWhiteboardUrls: (whiteboardId: string, roomId: string) => void;
}

export const useWhiteboard = create<WhiteboardStore>((set) => ({
  whiteboardDialogOpen: false,
  whiteboardId: null,
  whiteboardUrl: null,
  urls: new Map(),
  openWhiteboardDialog: (id: string) =>
    set((state) => {
      const url = state.urls.get(id);

      if (url) {
        state.whiteboardUrl = url;
      }

      const game = phaserGame.scene.keys.game as Game;
      game.disableKeys();

      return { whiteboardDialogOpen: true, whiteboardId: id };
    }),
  closeWhiteboardDialog: () =>
    set((state) => {
      const game = phaserGame.scene.keys.game as Game;

      game.enableKeys();
      game.network.disconnectFromWhiteboard(state.whiteboardId!);

      return {
        whiteboardDialogOpen: false,
        whiteboardId: null,
        whiteboardUrl: null,
      };
    }),
  setWhiteboardUrls: (whiteboardId: string, roomId: string) =>
    set((state) => {
      //TODO: make server url
      state.urls.set(whiteboardId, "");

      return {};
    }),
}));
