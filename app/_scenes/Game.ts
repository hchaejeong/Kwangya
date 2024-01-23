"use client";

import * as Phaser from "phaser";
import { createCharacterAnims } from "../_actions/character_animations";
import { Keyboard, NavKeys } from "@/types/Keyboard";
import MyPlayer from "../_actions/my_player";
import { PlayerMovement } from "../_actions/player_movement";
import Network from "../_services/network";
import OtherPlayer from "../_actions/other_player";
import { IPlayer } from "@/types/N1Building";
import Computer from "../_items/computer";
import Chair from "../_items/chair";
import Whiteboard from "../_items/whiteboard";
import Item from "../_items/item";
import { PlayerBehavior } from "@/types/PlayerBehavior";
import { Items } from "@/types/Items";
import { setShowChat, setFocused } from "../_stores/ChatStore";
import store from "../_stores";

export default class Game extends Phaser.Scene {
  network!: Network;
  myPlayer!: MyPlayer;
  private otherPlayers!: Phaser.Physics.Arcade.Group;
  private otherPlayerMap = new Map<string, OtherPlayer>();
  private cursors!: NavKeys;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keyR!: Phaser.Input.Keyboard.Key;
  private map!: Phaser.Tilemaps.Tilemap;
  private playerSelector!: Phaser.GameObjects.Zone;
  computerMap = new Map<string, Computer>();
  private whiteboardMap = new Map<string, Whiteboard>();
  // private whiteboardMap = new Map<string, Whiteboard>()

  constructor() {
    super("game");
  }

  registerKeys() {
    const cursorKeys = this.input.keyboard?.createCursorKeys();
    const customKeys = this.input.keyboard?.addKeys("W,S,A,D") as Keyboard;

    this.cursors = {
      W: customKeys.W,
      S: customKeys.S,
      A: customKeys.A,
      D: customKeys.D,
      up: cursorKeys?.up!,
      down: cursorKeys?.down!,
      left: cursorKeys?.left!,
      right: cursorKeys?.right!,
      space: cursorKeys?.space!,
      shift: cursorKeys?.shift!,
    };

    //추가로 사용할 key들 정의해줌
    this.keyE = this.input.keyboard?.addKey("E")!;
    this.keyR = this.input.keyboard?.addKey("R")!;

    this.input.keyboard?.disableGlobalCapture();
    //여기서 chatting할때 쓰는 enter랑 esc를 또 정의해준다

    this.input.keyboard?.on("keydown-ENTER", () => {
      store.dispatch(setShowChat(true));
      store.dispatch(setFocused(true));
    });
    this.input.keyboard?.on("keydown-ESC", () => {
      store.dispatch(setShowChat(false));
    });
  }

  disableKeys() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = false;
    }
  }

  enableKeys() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = true;
    }
  }

  //object들 생성하고 배치해야한다
  create(data: { network: Network }) {
    if (!data.network) {
      throw new Error("no server instance");
    } else {
      this.network = data.network;
    }

    createCharacterAnims(this.anims);

    //실제 게임 맵에 사용될 타일 맵을 먼저 깔아야함 map.json에서 tilemap 부분을 가져와서 렌더링
    //1. make tilemap을 사용해서 기본 맵을 깔아주고 2. 이 맵에서 사용될 실제 타일 이미지들을 불러오기 3. 레이어를 만들어서 씌워주기
    this.map = this.make.tilemap({ key: "tilemap" });
    //(tilemap으로 쓸 이미지 파일 이름, 우리가 정해주는 이 타일 부분의 이름 key)
    const FloorAndGround = this.map.addTilesetImage(
      "FloorAndGround",
      "tiles_wall"
    );
    if (FloorAndGround) {
      const ground = this.map.createLayer("Ground", FloorAndGround);
      ground?.setCollisionByProperty({ collides: true });

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
          // Create and return an instance of MyPlayer
          return new MyPlayer(this.scene, x, y, texture, id, frame);
        }
      );

      this.myPlayer = this.add.myPlayer(
        705,
        500,
        "adam",
        this.network.mysessionId
      );
      this.playerSelector = new PlayerMovement(this, 0, 0, 16, 16);

      if (ground) {
        this.physics.add.collider(
          [this.myPlayer, this.myPlayer.playerContainer],
          ground
        );
      }
      //안 움직이는 built in object group을 다 추가 (벽, 오피스 아이템들, 등)
    } else {
      throw new Error("no tileset found");
    }

    this.cameras.main.zoom = 1.5;
    this.cameras.main.startFollow(this.myPlayer, true);

    //각 아이템들 추가 필요 (의자, 컴퓨터, 화이트보드, 커피머신)
    const chairs = this.physics.add.staticGroup({ classType: Chair });
    //Tiled에서 의자들은 Chair이라는 레이어로 따로 관리해줌
    const chairLayer = this.map.getObjectLayer("Chair");
    chairLayer?.objects.forEach((chairObj) => {
      const item = this.addObjectElements(
        chairs,
        chairObj,
        "chairs",
        "chair"
      ) as Chair;
      //Tiled에서 custom properties의 첫 value로 direction을 적어놨다 (left, right, up, down)
      if (chairObj.properties) {
        item.itemDirection = chairObj.properties[0].value;
      }
    });

    const computers = this.physics.add.staticGroup({ classType: Computer });
    const computerLayer = this.map.getObjectLayer("Computer");
    computerLayer?.objects.forEach((computer, i) => {
      const item = this.addObjectElements(
        computers,
        computer,
        "computers",
        "computer"
      ) as Computer;
      //computer랑 whiteboard는 id로 object를 지정해줘야함
      item.setDepth(item.y + item.height * 0.27);
      const id = `${i}`;
      item.id = id;
      this.computerMap.set(id, item);
    });

    const whiteboards = this.physics.add.staticGroup({ classType: Whiteboard });
    const whiteboardLayer = this.map.getObjectLayer("Whiteboard");
    whiteboardLayer?.objects.forEach((whiteboard, i) => {
      const item = this.addObjectElements(
        whiteboards,
        whiteboard,
        "whiteboards",
        "whiteboard"
      ) as Whiteboard;
      const id = `${i}`;
      item.id = id;
      this.whiteboardMap.set(id, item);
    });

    this.addStaticGroupElements("Wall", "tiles_wall", "FloorAndGround", false);
    this.addStaticGroupElements(
      "Objects",
      "office",
      "Modern_Office_Black_Shadow",
      false
    );
    this.addStaticGroupElements(
      "ObjectsOnCollide",
      "office",
      "Modern_Office_Black_Shadow",
      true
    );
    this.addStaticGroupElements("GenericObjects", "generic", "Generic", false);
    this.addStaticGroupElements(
      "GenericObjectsOnCollide",
      "generic",
      "Generic",
      true
    );
    this.addStaticGroupElements("Basement", "basement", "Basement", true);

    //const coffeeMachines = this.physics.add.staticGroup({ classType:})
    //this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], vendingMachines)

    this.otherPlayers = this.physics.add.group({ classType: OtherPlayer });

    //내 플레이어랑 아이템들 (컴퓨터, 화이트보드, 의자, 커피머신)이랑 다른 플레이어들과는 collide 말고 overlap 시킨다
    this.physics.add.overlap(
      this.playerSelector,
      [chairs, computers, whiteboards],
      this.handleItemSelectorOverlap,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.playerSelector,
      this.otherPlayers,
      this.handlePlayersOverlap,
      undefined,
      this
    );

    this.network.onPlayerJoined(this.handlePlayerJoined, this);
    this.network.onPlayerLeft(this.handlePlayerLeft, this);
    this.network.onMyPlayerReady(this.handleMyPlayerReady, this);
    this.network.onMyPlayerVideoConnected(this.handleMyPlayerConnected, this);
    this.network.onPlayerUpdated(this.handlePlayerUpdated, this);
    this.network.onItemUserAdded(this.handleItemUserAdded, this);
    this.network.onItemUserRemoved(this.handleItemUserRemoved, this);
    this.network.onChatMessageAdded(this.handleChatMessageAdded, this);
  }

  private handlePlayersOverlap(myPlayer: any, otherPlayer: any) {
    otherPlayer.makeCall(myPlayer, this.network?.webRTC);
  }

  private addObjectElements(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string
  ) {
    //실제 중간값의 좌표를 찾고 해당 object를 찾아서 띄우기
    const x_position = object.x! + object.width! * 0.5;
    const y_position = object.y! - object.height! * 0.5;

    const tileset = this.map.getTileset(tilesetName);
    if (tileset) {
      const firstGid = tileset.firstgid;
      const itemObj = group
        .get(x_position, y_position, key, object.gid! - firstGid)
        .setDepth(y_position);
      return itemObj;
    } else {
      throw new Error("tileset is not found for " + tilesetName);
    }
  }

  private addStaticGroupElements(
    objectName: string,
    key: string,
    tilesetName: string,
    collideWithPlayer: boolean
  ) {
    const staticGroup = this.physics.add.staticGroup();
    //object 이름으로 찾고 싶은 object을 맵에서 다 불러온다
    const objectLayer = this.map.getObjectLayer(objectName);
    objectLayer?.objects.forEach((object) => {
      //실제 x,y좌표를 중간값으로 설정하면 실제 object의 위치
      const x_position = object.x! + object.width! * 0.5;
      const y_position = object.y! - object.height! * 0.5;
      const tileset = this.map.getTileset(tilesetName);
      if (tileset) {
        const firstGid = tileset.firstgid;
        staticGroup
          .get(x_position, y_position, key, object.gid! - firstGid)
          .setDepth(y_position);
      } else {
        console.log(`Tileset '${tilesetName}' not found`);
      }
    });

    //지금 플레이어가 방에 들어와있고 object이 충돌되는 오브젝트 그룹이면 서로 겹치지 않고 밀어내도록 구현
    if (this.myPlayer && collideWithPlayer) {
      this.physics.add.collider(
        [this.myPlayer, this.myPlayer.playerContainer],
        staticGroup
      );
    }
  }

  private handleItemSelectorOverlap(playerSelector: any, selectionItem: any) {
    const item = playerSelector.selectedItem as Item;
    //아직 플레이어가 아이템들과 연결되어있지 않을때 item은 현재 undefined인 상태
    if (item) {
      //현재 연결된 아이템과 아직 연결되어있을때 굳이 바꿀 부분이 없다
      if (item === selectionItem || item.depth >= selectionItem.depth) {
        return;
      }

      if (this.myPlayer.playerBehavior !== PlayerBehavior.SITTING) {
        item.clearDialogBox();
      }
    }

    console.log("item:", selectionItem);
    playerSelector.selectedItem = selectionItem;
    selectionItem.onOverlapDialog();
  }

  private handlePlayerJoined(newPlayer: IPlayer, id: string) {
    const texture = newPlayer.anim.split("_")[0];
    const otherPlayer = this.add.otherPlayer(
      newPlayer.x,
      newPlayer.y,
      texture,
      id,
      newPlayer.name
    );
    this.otherPlayers.add(otherPlayer);
    this.otherPlayerMap.set(id, otherPlayer);
  }

  //현재 플레이어가 연결된 다른 플레이어 리스트에서 제거
  private handlePlayerLeft(id: string) {
    if (this.otherPlayerMap.has(id)) {
      const otherPlayer = this.otherPlayerMap.get(id);
      if (!otherPlayer) return;
      this.otherPlayers.remove(otherPlayer, true, true);
      this.otherPlayerMap.delete(id);
    }
  }

  private handleMyPlayerReady() {
    this.myPlayer.readyToConnect = true;
  }

  private handleMyPlayerConnected() {
    this.myPlayer.videoConnected = true;
  }

  //player가 변경될때 target position을 업데이트해주는것
  private handlePlayerUpdated(
    field: string,
    value: number | string | boolean,
    id: string
  ) {
    const otherPlayer = this.otherPlayerMap.get(id);
    otherPlayer?.updatePlayer(field, value);
    console.log("other player being updated");
  }

  private handleItemUserAdded(
    playerId: string,
    itemId: string,
    itemType: Items
  ) {
    if (itemType === Items.COMPUTER) {
      this.computerMap.get(itemId)?.addCurrentUser(playerId);
    } else if (itemType === Items.WHITEBOARD) {
      this.whiteboardMap.get(itemId)?.addCurrentUser(playerId);
    }
  }

  private handleItemUserRemoved(
    playerId: string,
    itemId: string,
    itemType: Items
  ) {
    if (itemType === Items.COMPUTER) {
      this.computerMap.get(itemId)?.removeCurrentUser(playerId);
    } else if (itemType === Items.WHITEBOARD) {
      this.whiteboardMap.get(itemId)?.removeCurrentUser(playerId);
    }
  }

  private handleChatMessageAdded(playerId: string, message: string) {
    const otherPlayer = this.otherPlayerMap
      .get(playerId)
      ?.updatePlayerDialog(message);
  }

  update(time: number, delta: number): void {
    //현재 네트워크가 연결되어있고 플레이어가 최소 한명 존재할때만 업데이트
    if (this.myPlayer && this.network) {
      //현재 쓰이고 있는 key들에 따른 플레이어 움직임 업데이트
      this.playerSelector.update(this.myPlayer, this.cursors);
      this.myPlayer.update(
        this.playerSelector,
        this.cursors,
        this.keyE,
        this.keyR,
        this.network
      );
    }
  }
}
