"use client";

import * as Phaser from "phaser";
import Player, { sittingPosition } from "./player";
import MyPlayer from "./my_player";
import WebRTC from "../_web/WebRTC";
import { Event, phaserEvents } from "../_events/event-center";

//현재 플레이어들이 서로 가까이 다가갔을때 필요한 비디오, 플레이어 정보 띄워주기, 모션 기능들
export default class OtherPlayer extends Player {
  private playerContainerBody: Phaser.Physics.Arcade.Body;
  //어느 플레이어와 연결되어있는지
  private myPlayer?: MyPlayer;
  private connected: boolean;
  //모든 플레이어들의 위치가 stable하게 잘 잡혀있고 나서 웹캠 연결을 하기 위해 buffer 시간을 세팅하고 사용
  private bufferTime: number;
  //플레이어가 다른 플레이어와 연결될때 이동해야할 좌표
  private targetPosition: [number, number];
  private lastUpdateTimestamp?: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    name: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, id, frame);

    //현재 target position은 현재 위치좌표
    this.targetPosition = [x, y];
    //일단 다른 플레이어와 연결되어 있지 않은 초기 상태
    this.connected = false;
    this.bufferTime = 0;
    this.playerName.setText(name);
    this.playerContainerBody = this.playerContainer
      .body as Phaser.Physics.Arcade.Body;
  }

  //플레이어들이 서로 가까워지면 웹캠을 띄워서 화상연결 가능하도록 구현
  makeCall(myPlayer: MyPlayer, webRTC: WebRTC) {
    this.myPlayer = myPlayer;
    console.log("ready to connect");
    console.log(
      "state:",
      !this.connected,
      this.bufferTime >= 750,
      myPlayer.readyToConnect,
      this.readyToConnect,
      myPlayer.videoConnected,
      myPlayer.playerId > this.playerId
    );
    //플레이어들의 캠이 ready한 상태이고 버퍼타임이 어느정도 있는 다음에 웹캠 연결이 가능하다
    //한명만 연결 시도를 하도록 하기 위해 id가 더 높은 사람이 webRTC 커넥션을 요청하는 방식을 사용
    if (
      !this.connected &&
      this.bufferTime >= 750 &&
      myPlayer.readyToConnect &&
      this.readyToConnect &&
      myPlayer.videoConnected &&
      myPlayer.playerId > this.playerId
    ) {
      console.log("connect");
      webRTC.connectToNewUser(this.playerId);
      //연결되면 연결된 status 업데이트해주고 버퍼타임 다시 초기화
      this.connected = true;
      this.bufferTime = 0;
    }
  }

  updatePlayer(field: string, value: string | number | boolean) {
    if (field === "name" && typeof value === "string") {
      this.playerName.setText(value);
    } else if (field === "x" && typeof value === "number") {
      this.targetPosition[0] = value;
    } else if (field === "y" && typeof value === "number") {
      this.targetPosition[1] = value;
    } else if (field === "anim" && typeof value === "string") {
      this.anims.play(value, true);
    } else if (field === "readyToConnect" && typeof value === "boolean") {
      this.readyToConnect = value;
    } else if (field === "videoConnected" && typeof value === "boolean") {
      this.videoConnected = value;
    }
  }

  //phaser에서 제공하는 method으로 게임 오프젝트를 하나 제거할때 자동으로 사용됨.
  destroy(fromScene?: boolean | undefined): void {
    this.playerContainer.destroy();

    super.destroy(fromScene);
  }

  //모든 게임 object한테 매 frame마다 업데이트 시켜줘서 multiplayer상황에서도 빠르게 비디오 연결, 움직임 같은게 다 sync 되도록 해주는 부분
  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    //렉 걸려서 계속 position이 업데이트가 안되는걸 방지하기 위해서 lastUpdateTimestamp가 1초가 지난 경우 그냥 바로 targer position으로 이동시켜줌
    if (this.lastUpdateTimestamp && time - this.lastUpdateTimestamp > 750) {
      //현재 시간으로 timestamp 업데이트 해줌
      this.lastUpdateTimestamp = time;
      this.x = this.targetPosition[0];
      this.y = this.targetPosition[1];
      this.playerContainer.x = this.targetPosition[0];
      this.playerContainer.y = this.targetPosition[1] - 30;
      return;
    }

    //잘 작동되는 경우
    this.lastUpdateTimestamp = time;
    //밑에 나타나는 component가 더 위에 오는것처럼 나타내기 위해서 position이 바뀔때마다 depth 다시 설정 필요 (실제 시각화)
    this.setDepth(this.y);

    const animationParts = this.anims.currentAnim?.key.split("_");
    if (animationParts && animationParts[1] === "sit") {
      const direction = animationParts[2] as keyof typeof sittingPosition;
      const sittingOnLeftOrRight = sittingPosition[direction];
      if (sittingOnLeftOrRight) {
        // player가 앉으면 각 direction마다 depth를 다르게 설정한거를 적용시켜놓기
        this.setDepth(this.depth + sittingPosition[direction][2]);
      }
    }

    //in pixels per second
    const speed = 200;
    //delta가 ms 단위로 되어 있어서 delta안에 갈 수 있는 거리 계산
    const dx = (speed / 1000) * delta;

    var xRemaining = this.targetPosition[0] - this.x;
    var yRemaining = this.targetPosition[1] - this.y;
    //플레이어가 다른 플레이어와의 위치 (targetPosition)이랑 가까워지면 그냥 바로 이동시켜주기
    if (Math.abs(xRemaining) < dx) {
      this.x = this.targetPosition[0];
      this.playerContainer.x = this.targetPosition[0];
      xRemaining = 0;
    }
    if (Math.abs(yRemaining) < delta) {
      this.y = this.targetPosition[1];
      this.playerContainer.y = this.targetPosition[1] - 30;
      yRemaining = 0;
    }

    //아직 target위치랑 조금 거리가 있으면 그 위치까지 갈 수 있도록 velocity 새로 설정해서 움직이도록 설정
    var vx = 0;
    var vy = 0;
    //이미 target위치로 이동 되었으면 xRemaining, yRemaining = 0일테니 이 부분 패스할것
    if (xRemaining > 0) vx += speed;
    else if (xRemaining < 0) vx -= speed;
    if (yRemaining > 0) vy += speed;
    else if (yRemaining < 0) vy -= speed;

    this.updateVelocity(vx, vy);
    this.bufferTime += delta;

    //플레이어들이 연결된 상태에서 서로 overlap하지 않고 있을때 화상 연결을 끊는다
    //touching.none이랑 !embedded이 플레이어들이 서로 맞닿고 있지 않고 overlap이 되어 있지 않다는걸 체크
    if (
      this.connected &&
      this.body &&
      !this.body.embedded &&
      this.body.touching.none &&
      this.bufferTime >= 750
    ) {
      if (
        this.x < 610 &&
        this.y > 515 &&
        this.myPlayer!.x < 610 &&
        this.myPlayer!.y > 515
      )
        return;
      phaserEvents.emit(Event.PLAYER_DISCONNECTED, this.playerId);
      this.bufferTime = 0;
      this.connected = false;
    }
  }

  private updateVelocity(vx: number, vy: number) {
    this.setVelocity(vx, vy);
    this.body?.velocity.setLength(200);
    this.playerContainerBody.setVelocity(vx, vy);
    this.playerContainerBody.velocity.setLength(200);
  }
}

//새로 조인하는 플레이어는 이름 정보를 알고 있어야 연결이 가능함.
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      otherPlayer(
        x: number,
        y: number,
        texture: string,
        id: string,
        name: string,
        frame?: string | number
      ): OtherPlayer;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "otherPlayer",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    id: string,
    name: string,
    frame?: string | number
  ) {
    const sprite = new OtherPlayer(this.scene, x, y, texture, id, name, frame);

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
