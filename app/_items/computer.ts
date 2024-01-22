import { Items } from "@/types/Items";
import Item from "./item";
import { useComputer } from "../_stores/use-computer";
import Network from "../_services/network";

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

    const { computerId, shareScreenManager } = useComputer((state) => state);

    if (computerId === this.id) {
      shareScreenManager?.onUserJoined(userId);
    }
  }

  removeCurrentUser(userId: string) {
    if (!this.currentUsers || !this.currentUsers.has(userId)) return;

    this.currentUsers.delete(userId);

    const { computerId, shareScreenManager } = useComputer((state) => state);

    if (computerId === this.id) {
      shareScreenManager?.onUserLeft(userId);
    }

    this.updateStatus();
  }

  openDialog(playerId: string, network: Network) {
    if (!this.id) return;

    const { openComputerDialog } = useComputer((state) => state);

    openComputerDialog(this.id, playerId);
    network.connectToComputer(this.id);
  }
}
