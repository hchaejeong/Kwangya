import { openWhiteboardDialog } from "../_stores/WhiteboardStore";
import Network from "../_services/network";
import Item from "./item";
import store from "../_stores";
import { Items } from "@/types/Items";

export default class Whiteboard extends Item {
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

    this.itemType = Items.WHITEBOARD;
  }

  private updateStatus() {
    if (!this.currentUsers) {
      this.clearStatusBox;
      return;
    }
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
      this.setDialogBox("Press R to use whiteboard");
    } else {
      this.setDialogBox("Press R join");
    }
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return;
    this.currentUsers.add(userId);
    this.updateStatus();
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.has(userId)) return;
    this.currentUsers.delete(userId);
    this.updateStatus();
  }

  openDialog(network: Network) {
    if (!this.id) return;
    store.dispatch(openWhiteboardDialog(this.id));
    network.connectToWhiteboard(this.id);
  }
}
