import { Items } from "@/types/Items";
import * as Phaser from "phaser";

export default class Item extends Phaser.Physics.Arcade.Sprite {
  private dialogBox!: Phaser.GameObjects.Container;
  private statusBox!: Phaser.GameObjects.Container;
  itemType!: Items;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    //add dialogBox and statusBox containers on top of everything which we can add text
    this.dialogBox = this.scene.add.container().setDepth(10000);
    this.statusBox = this.scene.add.container().setDepth(10000);
  }

  //add text into dialogBox container
  setDialogBox(text: string) {
    const innerText = this.scene.add
      .text(0, 0, text)
      .setFontFamily("Arial")
      .setFontSize(12)
      .setColor("#000000");

    //set the size and position of dialogBox
    const dialogBoxWidth = innerText.width + 4;
    const dialogBoxHeight = innerText.height + 2;
    const dialogBoxX = this.x - dialogBoxWidth * 0.5;
    const dialogBoxY = this.y + this.height * 0.5;

    //style of dialogBox
    this.dialogBox.add(
      this.scene.add
        .graphics()
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(
          dialogBoxX,
          dialogBoxY,
          dialogBoxWidth,
          dialogBoxHeight,
          3
        )
        .lineStyle(1.5, 0x000000, 1)
        .strokeRoundedRect(
          dialogBoxX,
          dialogBoxY,
          dialogBoxWidth,
          dialogBoxHeight,
          3
        )
    );
    this.dialogBox.add(innerText.setPosition(dialogBoxX + 2, dialogBoxY));
  }

  clearDialogBox() {
    this.dialogBox.removeAll(true);
  }

  //add text into statusBox container
  setStatusBox(text: string) {
    const innerText = this.scene.add
      .text(0, 0, text)
      .setFontFamily("Arial")
      .setFontSize(12)
      .setColor("#000000");

    //set the size and position of statusBox
    const statusBoxWidth = innerText.width + 4;
    const statusBoxHeight = innerText.height + 2;
    const statusBoxX = this.x - statusBoxWidth * 0.5;
    const statusBoxY = this.y - this.height * 0.25;

    //style of statusBox
    this.statusBox.add(
      this.scene.add
        .graphics()
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(
          statusBoxX,
          statusBoxY,
          statusBoxWidth,
          statusBoxHeight,
          3
        )
        .lineStyle(1.5, 0x000000, 1)
        .strokeRoundedRect(
          statusBoxX,
          statusBoxY,
          statusBoxWidth,
          statusBoxHeight,
          3
        )
    );
    this.statusBox.add(innerText.setPosition(statusBoxX + 2, statusBoxY));
  }

  clearStatusBox() {
    this.statusBox.removeAll(true);
  }
}
