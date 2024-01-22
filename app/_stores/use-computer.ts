"use client";

import Peer, { MediaConnection } from "peerjs";
import { create } from "zustand";
import phaserGame from "../PhaserGame";
import Game from "../_scenes/Game";
import { sanitizeId } from "../_components/util";
import ShareScreenManager from "../_web/ShareScreenManager";

interface ComputerStore {
  computerDialogOpen: boolean;
  computerId: null | string;
  myStream: null | MediaStream;
  peerStreams: Map<string, { stream: MediaStream; call: MediaConnection }>;
  shareScreenManager: null | ShareScreenManager;
  openComputerDialog: (computerId: string, myUserId: string) => void;
  closeComputerDialog: () => void;
  setMyStream: (stream: null | MediaStream) => void;
  addVideoStream: (
    id: string,
    call: MediaConnection,
    stream: MediaStream
  ) => void;
  removeVideoStream: (id: string) => void;
}

export const useComputer = create<ComputerStore>((set) => ({
  computerDialogOpen: false,
  computerId: null,
  myStream: null,
  peerStreams: new Map(),
  shareScreenManager: null,
  openComputerDialog: (computerId: string, myUserId: string) =>
    set((state) => {
      if (!state.shareScreenManager) {
        state.shareScreenManager = new ShareScreenManager(myUserId);
      }

      const game = phaserGame.scene.keys.game as Game;

      game.disableKeys(); // disable keys while sharing
      state.shareScreenManager.onOpen();

      return { computerDialogOpen: true, computerId: computerId };
    }),
  closeComputerDialog: () =>
    set((state) => {
      const game = phaserGame.scene.keys.game as Game;

      game.enableKeys(); //enable keys when stop sharing
      game.network.disconnectFromComputer(state.computerId!);

      for (const { call } of state.peerStreams.values()) {
        call.close();
      }

      state.shareScreenManager?.onClose();
      state.peerStreams.clear();

      return { computerDialogOpen: false, myStream: null, computerId: null };
    }),
  setMyStream: (stream: null | MediaStream) =>
    set((state) => ({
      myStream: stream,
    })),
  addVideoStream: (id: string, call: MediaConnection, stream: MediaStream) =>
    set((state) => {
      state.peerStreams.set(sanitizeId(id), {
        call: call,
        stream: stream,
      });

      return {};
    }),
  removeVideoStream: (id: string) =>
    set((state) => {
      state.peerStreams.delete(sanitizeId(id));

      return {};
    }),
}));
