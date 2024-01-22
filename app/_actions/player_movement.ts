import * as Phaser from "phaser";

import { NavKeys } from "@/types/Keyboard";
import { PlayerBehavior } from "@/types/PlayerBehavior";
import MyPlayerMovement from "./my_player";
import Item from "../_items/item";

//player가 게임 맵에서 다른 요소들과 소통하고 교류할 수 있도록 해주는 부분
export class PlayerMovement extends Phaser.GameObjects.Zone {
  //의자, 컴퓨터, 화이트보드 아이템들과 플레이어랑 가까워지면 dialog 띄워주는 느낌
  item?: Item;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width, height);

    //game scene에 존재하는 object들을 다 physics에 추가해서 각 object들의 충돌 모션을 컨트롤해준다
    scene.physics.add.existing(this);
  }

  update(player: MyPlayerMovement, keys: NavKeys): void {
    //a player that is sitting down does not need animation
    if (player.playerBehavior === PlayerBehavior.SITTING) {
      return;
    }

    if (!keys) {
      return;
    }

    //현재 플레이어의 위치 좌표를 받아오자
    const { x, y } = player;
    var joystickLeft = false;
    var joystickRight = false;
    var joystickUp = false;
    var joystickDown = false;
    //keyboard 또는 Joystick의 방향을 이용해서 플레이어를 움직이는 부분
    if (player.joystickMovement?.beingUsed) {
      if (player.joystickMovement?.direction.left) {
        joystickLeft = true;
      } else if (player.joystickMovement?.direction.right) {
        joystickRight = true;
      } else if (player.joystickMovement?.direction.up) {
        joystickUp = true;
      } else if (player.joystickMovement?.direction.down) {
        joystickDown = true;
      }
    }

    //movement will be 32 units per step
    if (joystickLeft || keys.left.isDown || keys.A.isDown) {
      this.setPosition(x - 32, y);
    } else if (joystickRight || keys.right.isDown || keys.D.isDown) {
      this.setPosition(x + 32, y);
    } else if (joystickUp || keys.up.isDown || keys.W.isDown) {
      //row index가 작아지면 올라가는 모션
      this.setPosition(x, y - 32);
    } else if (joystickDown || keys.down.isDown || keys.S.isDown) {
      this.setPosition(x, y + 32);
    }

    if (this.item) {
      //player랑 다른 아이템 (컴퓨터, 화이트보드, 의자)와 collide하고 있지 않으면 dialog 띄울 필요 없음
      if (!this.scene.physics.overlap(this, this.item)) {
        this.item.clearDialogBox();
        this.item = undefined;
      }
    }
  }
}
