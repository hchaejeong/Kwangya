import { Items } from "@/types/Items";
import Item from "./item";

export default class Chair extends Item {
  itemDirection?: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.itemType = Items.CHAIR;
  }

  onOverlapDialog() {
    this.setDialogBox("Press E to sit");
  }
}
