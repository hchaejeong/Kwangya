"use client";

import { Items } from "@/types/Items";
import Item from "./item";
import { useComputer } from "../_stores/use-computer";
import Network from "../_services/network";
import store from "../_stores";
import { openComputerDialog } from "../_stores/ComputerStore";
import { useAppSelector } from "../hooks";

export default class Computer extends Item {
  id?: string;
  currentUsers = new Set<string>();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.itemType = Items.COMPUTER;
  }

  private updateStatus() {
    if (!this.currentUsers) return;

    const numberOfUsers = this.currentUsers.size;
    this.clearStatusBox();

    if (numberOfUsers === 1) {
      this.setStatusBox(`${numberOfUsers} user`);
    } else if (numberOfUsers > 1) {
      this.setStatusBox(`${numberOfUsers} users`);
    }
  }

  onOverlapDialog() {
    if (this.currentUsers.size === 0) {
      this.setDialogBox("Press R to use computer");
    } else {
      this.setDialogBox("Press R to join");
    }
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return;

    this.currentUsers.add(userId);

    const computerState = store.getState().computer;
    if (computerState.computerId === this.id) {
      computerState.shareScreenManager?.onUserJoined(userId);
    }
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.has(userId)) return;

    this.currentUsers.delete(userId);

    const computerId = useAppSelector((state) => state.computer.computerId);
    const shareScreenManager = useAppSelector(
      (state) => state.computer.shareScreenManager
    );

    if (computerId === this.id) {
      shareScreenManager?.onUserLeft(userId);
    }

    this.updateStatus();
  }

  openDialog(playerId: string, network: Network) {
    if (!this.id) return;

    store.dispatch(
      openComputerDialog({ computerId: this.id, myUserId: playerId })
    );
    network.connectToComputer(this.id);
  }
}
