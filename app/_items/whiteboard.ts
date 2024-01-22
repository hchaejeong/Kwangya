import { Items } from "@/types/Items";
import Item from "./item";
import Network from "../_services/network";
import { useWhiteboard } from "../_stores/use-whiteboard";

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
    if (this.currentUsers.size === 0) {
      this.setDialogBox("Press R to use whiteboard");
    } else {
      this.setDialogBox("Press R to join");
    }
  }

  addCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return;

    this.currentUsers.add(userId);
    this.updateStatus;
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || this.currentUsers.has(userId)) return;

    this.currentUsers.delete(userId);
    this.updateStatus;
  }

  openDialog(network: Network) {
    if (!this.id) return;

    const { openWhiteboardDialog } = useWhiteboard((state) => state);
    openWhiteboardDialog(this.id);

    network.connectToWhiteboard(this.id);
  }
}
