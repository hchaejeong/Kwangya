"use client";

import * as Phaser from "phaser";
import { NavKeys } from "@/types/Keyboard";
import { JoystickStatus } from "../_components/joystick_actions";
import Player, { sittingPosition } from "./player";
import { PlayerMovement } from "./player_movement";
import { PlayerBehavior } from "@/types/PlayerBehavior";
import { Items } from "@/types/Items";
import { phaserEvents, Event } from "../_events/event-center";
import Network from "../_services/network";
import Chair from "../_items/chair";
import Computer from "../_items/computer";
import Whiteboard from "../_items/whiteboard";
import store from "../_stores";
import { pushPlayerJoinedMessage } from "../_stores/ChatStore";
import Game from "../_scenes/Game";

//실제 플레이어의 움직임이랑 이름, dialog와 같은 기능들을 써놓은곳
export default class MyPlayer extends Player {
  private playerContainerBody: Phaser.Physics.Arcade.Body;
  public joystickMovement?: JoystickStatus;
  private sittingOnChair?: Chair;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, id, frame);
    //player를 생성할때 다른 object들과의 충돌과 빠른 움직임을 나타내기 위해서는 physics.body를 설정해줘야한다
    this.playerContainerBody = this.playerContainer
      .body as Phaser.Physics.Arcade.Body;
  }

  moveJoystick(movement: JoystickStatus) {
    this.joystickMovement = movement;
  }

  setPlayerName(name: string) {
    //text box에 text 추가해주기
    this.playerName.setText(name);
    //기다리고 있는 event listener에 player 이름 바뀌었다고 알려줘서 listener callback 실행
    phaserEvents.emit(Event.MY_PLAYER_NAME_CHANGE, name);
    store.dispatch(pushPlayerJoinedMessage(name));
  }

  setPlayerTexture(texture: string) {
    this.playerTexture = texture;
    this.anims.play(`${this.playerTexture}_idle_down`, true);
    phaserEvents.emit(
      Event.MY_PLAYER_TEXTURE_CHANGE,
      this.x,
      this.y,
      this.anims.currentAnim?.key
    );
  }

  update(
    playerMovement: PlayerMovement,
    keys: NavKeys,
    keyE: Phaser.Input.Keyboard.Key,
    keyR: Phaser.Input.Keyboard.Key,
    network: Network
  ): void {
    if (!keys) {
      return;
    }

    const item = playerMovement.selectedItem;
    if (Phaser.Input.Keyboard.JustDown(keyR)) {
      if (item?.itemType === Items.COMPUTER) {
        const computer = item as Computer;
        computer.openDialog(this.playerId, network);
      } else if (item?.itemType === Items.WHITEBOARD) {
        const whiteboard = item as Whiteboard;
        whiteboard.openDialog(network);
      } else if (item?.itemType === Items.COFFEE) {
        //TODO: 커피머신에서 url띄워서 커피 주문하기 창
      }
    }

    if (this.playerBehavior === PlayerBehavior.STANDING) {
      //의자 찾으면 앉도록 playerBehavior 바꿔주기
      if (
        Phaser.Input.Keyboard.JustDown(keyE) &&
        item?.itemType === Items.CHAIR
      ) {
        const chairItem = item as Chair;
        //chair에서 dialog띄워주고 어떤 의자에 앉고 있는지 chair도 지정해줘야함.
        this.scene.time.addEvent({
          //플레이어 움직임이 다 끝난후에 그 포지션이 잘 적용되도록 딜레이를 조금 넣어줌
          delay: 10,
          callback: () => {
            //그냥 앉는거니까 움직임을 0으로 세팅하면 된다
            this.setVelocity(0, 0);

            //chair의 방향에 따라 depth를 다르게 설정해줘야함
            if (chairItem.itemDirection) {
              const direction: string = chairItem.itemDirection;
              const position: "up" | "down" | "left" | "right" = direction as
                | "up"
                | "down"
                | "left"
                | "right";

              this.setPosition(
                chairItem.x + sittingPosition[position][0],
                chairItem.y + sittingPosition[position][1]
              ).setDepth(chairItem.depth + sittingPosition[position][2]);
              //player랑 player를 따라오는 body도 position을 의자에 맞게 업데이트 시켜줘야
              this.playerContainerBody.setVelocity(0, 0);
              this.playerContainer.setPosition(
                chairItem.x + sittingPosition[position][0],
                chairItem.y + sittingPosition[position][1] - 30
              );
            }

            //sitting하는걸로 바꿔줌
            this.play(
              `${this.playerTexture}_sit_${chairItem.itemDirection}`,
              true
            );
            playerMovement.selectedItem = undefined;
            if (chairItem.itemDirection === "up") {
              //player 위치를 새로 설정해줘야함 (의자에 앉아있는걸로)
              playerMovement.setPosition(this.x, this.y - this.height);
            } else {
              playerMovement.setPosition(0, 0);
            }

            if (this.anims.currentAnim) {
              network.updatePlayer(this.x, this.y, this.anims.currentAnim.key);
            }
          },
          loop: false,
        });
        //chair에 앉는 모션으로 바뀌고 chair위에 E를 눌러서 다시 일어나라는 말풍선 띄워주기
        chairItem.clearDialogBox();
        chairItem.setDialogBox("Press E to leave");
        this.sittingOnChair = chairItem;
        this.playerBehavior = PlayerBehavior.SITTING;
        return;
      }
      //서서 움직일때 모션 나타내기
      const speed = 200;
      let vx = 0;
      let vy = 0;

      var joystickLeft = false;
      var joystickRight = false;
      var joystickUp = false;
      var joystickDown = false;
      //keyboard 또는 Joystick의 방향을 이용해서 플레이어를 움직이는 부분
      if (this.joystickMovement?.beingUsed) {
        if (this.joystickMovement?.direction.left) {
          joystickLeft = true;
        } else if (this.joystickMovement?.direction.right) {
          joystickRight = true;
        } else if (this.joystickMovement?.direction.up) {
          joystickUp = true;
        } else if (this.joystickMovement?.direction.down) {
          joystickDown = true;
        }
      }
      if (joystickLeft || keys.left.isDown || keys.A.isDown) {
        vx -= speed;
      } else if (joystickRight || keys.right.isDown || keys.D.isDown) {
        vx += speed;
      } else if (joystickUp || keys.up.isDown || keys.W.isDown) {
        vy -= speed;
        this.setDepth(this.y);
      } else if (joystickDown || keys.down.isDown || keys.S.isDown) {
        vy += speed;
        this.setDepth(this.y);
      }

      //joystick angle에 따라 x랑 y축으로 동시에 이동하고 있을수도있기 때문에 velocity를 vx, vy로 설정해서 속도는 200으로 움직여주기
      const newVelocity = this.setVelocity(vx, vy);
      if (this.body) {
        this.body.velocity.setLength(speed);
      } else {
        console.log("body is not found");
      }
      this.playerContainerBody.setVelocity(vx, vy);
      this.playerContainerBody.velocity.setLength(speed);

      this.updatePlayerAnimation(vx, vy, network);
    } else if (this.playerBehavior === PlayerBehavior.SITTING) {
      //key E를 누르면 다시 일어나서 움직이는 모션
      if (Phaser.Input.Keyboard.JustDown(keyE)) {
        //플레이어 idle한 애니메이션으로 바꿔주고 chair dialog없애주기
        //플레이어 위치 다시 설정해주고 움직일수있도록
        this.sittingOnChair?.clearDialogBox();
        playerMovement.setPosition(this.x, this.y);
        playerMovement.update(this, keys);
        const animationParts = this.anims.currentAnim?.key.split("_");
        if (animationParts) {
          animationParts[1] = "idle";
          this.play(animationParts.join("_"), true);
          this.playerBehavior = PlayerBehavior.STANDING;
        }
        if (this.anims.currentAnim) {
          network.updatePlayer(this.x, this.y, this.anims.currentAnim.key);
        } else {
          console.log("no animation available");
        }
      }
    }
  }

  //player animation이랑 새로운 location을 server로 보내주는 역할
  updatePlayerAnimation(vx: number, vy: number, network: Network) {
    if (this.anims.currentAnim) {
      if (vx !== 0 || vy !== 0) {
        network.updatePlayer(this.x, this.y, this.anims.currentAnim.key);
      }
      if (vx > 0) {
        this.play(`${this.playerTexture}_run_right`, true);
      } else if (vx < 0) {
        this.play(`${this.playerTexture}_run_left`, true);
      } else if (vy < 0) {
        this.play(`${this.playerTexture}_run_up`, true);
      } else if (vy > 0) {
        this.play(`${this.playerTexture}_run_down`, true);
      } else {
        const parts = this.anims.currentAnim.key.split("_");
        parts[1] = "idle";
        const newAnim = parts.join("_");
        // this prevents idle animation keeps getting called
        if (this.anims.currentAnim.key !== newAnim) {
          this.play(parts.join("_"), true);
          // send new location and anim to server
          network.updatePlayer(this.x, this.y, this.anims.currentAnim.key);
        }
      }
    } else {
      console.log("No animation found");
    }
  }
}

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      myPlayer(
        x: number,
        y: number,
        texture: string,
        id: string,
        frame?: string | number
      ): MyPlayer;
    }
  }
}

//현재 내 플레이어를 object으로 게임에 등록해줘야한다
Phaser.GameObjects.GameObjectFactory.register(
  "myPlayer",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number
  ) {
    const sprite = new MyPlayer(this.scene, x, y, texture, id, frame);

    //phaser가 사용하는 게임 object관리하는 list들에다가 my player에 해당하는 플레이어 object 추가하기
    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body
      ?.setSize(sprite.width * 0.5, sprite.height * 0.2)
      .setOffset(sprite.width * 0.5 * 0.5, sprite.height * 0.8);

    return sprite;
  }
);
