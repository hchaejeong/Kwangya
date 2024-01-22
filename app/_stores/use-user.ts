"use client";

import { BackgroundMode } from "@/types/BackgroundMode";
import { create } from "zustand";
import { sanitizeId } from "../_components/util";

interface UserState {
  backgroundMode: BackgroundMode;
  sessionId: string;
  videoConnected: boolean;
  loggedIn: boolean;
  playerNameMap: Map<string, string>;
  showJoystick: boolean;
  toggleBackgroundMode: () => void;
  setSessionId: (sessionId: string) => void;
  setVideoConnected: (videoConnected: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setPlayerNameMap: (id: string, name: string) => void;
  removePlayerNameMap: (id: string) => void;
  setShowJoystick: (showJoystick: boolean) => void;
}

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours();
  return currentHour > 6 && currentHour <= 18
    ? BackgroundMode.DAY
    : BackgroundMode.NIGHT;
}

export const useUserStore = create<UserState>((set) => ({
  backgroundMode: getInitialBackgroundMode(),
  sessionId: "",
  videoConnected: false,
  loggedIn: false,
  playerNameMap: new Map<string, string>(),
  showJoystick: window.innerWidth < 650,
  toggleBackgroundMode: () =>
    set((state) => ({
      backgroundMode:
        state.backgroundMode === BackgroundMode.DAY
          ? BackgroundMode.NIGHT
          : BackgroundMode.DAY,
    })),
  setSessionId: (sessionId: string) => set(() => ({ sessionId })),
  setVideoConnected: (videoConnected: boolean) =>
    set(() => ({ videoConnected })),
  setLoggedIn: (loggedIn: boolean) => set(() => ({ loggedIn })),
  setPlayerNameMap: (id: string, name: string) =>
    set((state) => ({
      playerNameMap: new Map(state.playerNameMap).set(sanitizeId(id), name),
    })),
  removePlayerNameMap: (id: string) =>
    set((state) => {
      const updatedMap = new Map(state.playerNameMap);
      updatedMap.delete(sanitizeId(id));

      return { playerNameMap: updatedMap };
    }),
  setShowJoystick: (showJoystick: boolean) => set(() => ({ showJoystick })),
}));
