"use client";

import { Message } from "@/types/Messages";
import { Client, Room } from "colyseus.js";
import { Event, phaserEvents } from "../_events/event-center";
import { IRoomData } from "@/types/Room";
import {
  IChatting,
  IComputer,
  IN1Building,
  IPlayer,
  IWhiteBoard,
} from "@/types/N1Building";
import WebRTC from "../_web/WebRTC";
import { Items } from "@/types/Items";
import store from "../_stores";
import {
  addAvailableRooms,
  removeAvailableRooms,
  setAvailableRooms,
  setJoinedRoomData,
  setLobbyJoined,
} from "../_stores/RoomStore";
import {
  removePlayerNameMap,
  setPlayerNameMap,
  setSessionId,
} from "../_stores/UserStore";
import {
  pushChatMessage,
  pushPlayerJoinedMessage,
  pushPlayerLeftMessage,
} from "../_stores/ChatStore";
import { setWhiteboardUrls } from "../_stores/WhiteboardStore";

//network을 분리해야 플레이어가 다른 유저들의 움직임과 들어가고 나가는 것에 영향을 받지 않고 자유롭게 join하고 나가기위함이다
export default class Network {
  private client: Client;
  private room?: Room<IN1Building>;
  private lobby!: Room;
  webRTC?: WebRTC;
  mysessionId!: string;

  constructor() {
    const protocol = window.location.protocol.replace("http", "ws");
    const endpoint = `${protocol}//${window.location.hostname}:2567`;
    this.client = new Client(endpoint);
    //network는 client가 요청해서 서버에 연결하면 바로 Lobbyroom에 연결하도록
    this.joinLobbyRoom().then(() => {
      store.dispatch(setLobbyJoined(true));
    });

    phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this);
    phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this);
    phaserEvents.on(
      Event.PLAYER_DISCONNECTED,
      this.playerStreamDisconnect,
      this
    );
  }

  //서버와 연결하면 바로 room에 들어갈수 있는 로비룸으로 바로 연결
  async joinLobbyRoom() {
    this.lobby = await this.client.joinOrCreate("lobby");

    this.lobby.onMessage("rooms", (rooms) => {
      store.dispatch(setAvailableRooms(rooms));
    });

    this.lobby.onMessage("+", ([roomId, room]) => {
      store.dispatch(addAvailableRooms({ roomId, room }));
    });

    this.lobby.onMessage("-", (roomId) => {
      store.dispatch(removeAvailableRooms(roomId));
    });
  }

  async joinCustomById(roomId: string, password: string | null) {
    this.room = await this.client.joinById(roomId, { password });
    this.initialize();
  }

  async createCustom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData;
    this.room = await this.client.create("custom", {
      name,
      description,
      password,
      autoDispose,
    });
    this.initialize();
  }

  //게임 맵 생성 전에 어떤 동작할때 어떤 listener를 이용해 감지할지 다 설정해놓기
  initialize() {
    if (!this.room) return;

    //메인 로비 페이지에서 나가서 실제 생성된 룸에 들어가기
    this.lobby.leave();
    this.mysessionId = this.room.sessionId;
    store.dispatch(setSessionId(this.room.sessionId));
    //현재 네트워크에서 생성된 룸의 세션아이디로 들어가서 웹rtc를 생성하기
    this.webRTC = new WebRTC(this.mysessionId, this);

    //새로운 플레이어들 생성
    this.room.state.players.onAdd((player: IPlayer, key: string) => {
      if (key === this.mysessionId) return;
      console.log(player, "has been added at", key);

      //각 플레이어들의 변화를 changes으로 감지하고 각 field, value를 사용해서 플레이어 이름이랑 다른 attribute들을 업데이트 시켜준다
      // player.onChange((changes) => {
      //   console.log(111);
      //   changes.forEach((change) => {
      //     const { field, value } = change;
      //     phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key);

      //     // when a new player finished setting up player name
      //     if (field === "name" && value !== "") {
      //       phaserEvents.emit(Event.PLAYER_JOINED, player, key);
      //       store.dispatch(setPlayerNameMap({ id: key, name: value }));
      //       store.dispatch(pushPlayerJoinedMessage(value));
      //     }
      //   });
      // });

      // 각 플레이어들의 변화를 changes으로 감지하고 각 field, value를 사용해서 플레이어 이름이랑 다른 attribute들을 업데이트 시켜준다
      player.onChange(() => {
        // Access player properties directly from the player object
        const { name } = player;

        phaserEvents.emit(Event.PLAYER_UPDATED, "name", name, key);

        // when a new player finished setting up player name
        if (name !== "") {
          console.log("name: ", name);
          phaserEvents.emit(Event.PLAYER_JOINED, player, key);
          store.dispatch(setPlayerNameMap({ id: key, name: name }));
          store.dispatch(pushPlayerJoinedMessage(name));
        }
      });
    });

    //player가 방에서 나갈때 일어나는 일을 미리 설정
    this.room.state.players.onRemove((player: IPlayer, key: string) => {
      //연결된 웹캠 지우고 플레이어 이름을 맵에서 제거해야함
      phaserEvents.emit(Event.PLAYER_LEFT, key);

      store.dispatch(pushPlayerLeftMessage(player.name));
      store.dispatch(removePlayerNameMap(key));

      this.webRTC?.deleteVideoStream(key);
      this.webRTC?.deleteOnCalledVideoStream(key);
    });

    //아이템들 (computer, chair, whiteboard, chatting)도 다 onAdd를 사용해서 생성해줘야함
    //item에 연결된 유저가 추가되면 ITEM_USER_ADDED, 유저 연결 끊기면 ITEM_USER_REMOVED을 사용해서 다 업데이트 해줘야함
    this.room.state.computers.onAdd((computer: IComputer, key: string) => {
      computer.connectedUsers.onAdd((item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, Items.COMPUTER);
      });
      computer.connectedUsers.onRemove((item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, Items.COMPUTER);
      });
    });

    this.room.state.whiteboards.onAdd(
      (whiteboard: IWhiteBoard, key: string) => {
        whiteboard.connectedUsers.onAdd((item, index) => {
          //실제로 whiteboard의 url을 띄워줘야하기 때문에 setWhiteboardUrls 메서드를 사용
          store.dispatch(
            setWhiteboardUrls({ whiteboardId: key, roomId: whiteboard.roomId })
          );

          whiteboard.connectedUsers.onAdd((item, index) => {
            phaserEvents.emit(
              Event.ITEM_USER_ADDED,
              item,
              key,
              Items.WHITEBOARD
            );
          });
          whiteboard.connectedUsers.onRemove((item, index) => {
            phaserEvents.emit(
              Event.ITEM_USER_REMOVED,
              item,
              key,
              Items.WHITEBOARD
            );
          });
        });
      }
    );

    this.room.state.chatMessages.onAdd((chat: IChatting, key: number) => {
      store.dispatch(pushChatMessage(chat));
    });

    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedRoomData(content));
    });

    this.room.onMessage(Message.DISCONNECT_STREAM, (clientId: string) => {
      this.webRTC?.deleteOnCalledVideoStream(clientId);
    });

    this.room.onMessage(Message.STOP_SCREEN_SHARE, (clientId: string) => {
      const shareScreenManager = store.getState().computer.shareScreenManager;
      shareScreenManager?.onUserLeft(clientId);
    });
  }

  //채팅방에 유저가 더 들어올때 사용하는 이런 event listener랑 function 실행
  onChatMessageAdded(
    callback: (playerId: string, content: string) => void,
    context?: any
  ) {
    phaserEvents.on(Event.UPDATE_DIALOG_BUBBLE, callback, context);
  }

  // item을 사용하는 또는 공유하는 플레이어가 추가될 경우 사용하는 listener랑 method
  onItemUserAdded(
    callback: (playerId: string, key: string, itemType: Items) => void,
    context?: any
  ) {
    phaserEvents.on(Event.ITEM_USER_ADDED, callback, context);
  }

  // item을 사용하던 플레이어가 없어질때 사용하는 Listener랑 method
  onItemUserRemoved(
    callback: (playerId: string, key: string, itemType: Items) => void,
    context?: any
  ) {
    phaserEvents.on(Event.ITEM_USER_REMOVED, callback, context);
  }

  // player가 맵에 조인할때 callback하기 위한 listener method
  onPlayerJoined(
    callback: (Player: IPlayer, key: string) => void,
    context?: any
  ) {
    phaserEvents.on(Event.PLAYER_JOINED, callback, context);
  }

  // player가 다른 플레이어들과의 연결에서 나갈때 callback하기 위한 listener method
  onPlayerLeft(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_LEFT, callback, context);
  }

  // player가 웹캠이랑 아직 연결안되었을때 callback하기 위한 listener method
  onMyPlayerReady(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_READY, callback, context);
  }

  // player 비디오가 연결되었을때 callback하기 위한 listener method
  onMyPlayerVideoConnected(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_VIDEO_CONNECTED, callback, context);
  }

  // player가 다른 플레이어랑 업데이트할때 listen해주기
  onPlayerUpdated(
    callback: (field: string, value: number | string, key: string) => void,
    context?: any
  ) {
    phaserEvents.on(Event.PLAYER_UPDATED, callback, context);
  }

  // 현재 플레이어의 position이랑 이름, 애니메이션 상태 업데이트 꾸준히 해주기
  updatePlayer(currentX: number, currentY: number, currentAnim: string) {
    this.room?.send(Message.UPDATE_PLAYER, {
      x: currentX,
      y: currentY,
      anim: currentAnim,
    });
  }

  updatePlayerName(currentName: string) {
    this.room?.send(Message.UPDATE_PLAYER_NAME, { name: currentName });
  }

  // 서버랑 연결 될때
  readyToConnect() {
    this.room?.send(Message.READY_TO_CONNECT);
    phaserEvents.emit(Event.MY_PLAYER_READY);
  }

  // 비디오 연결되어있을때
  videoConnected() {
    this.room?.send(Message.VIDEO_CONNECTED);
    phaserEvents.emit(Event.MY_PLAYER_VIDEO_CONNECTED);
  }

  // 다른 플레이어의 웹캠이랑 연결 끊고싶을때
  playerStreamDisconnect(id: string) {
    this.room?.send(Message.DISCONNECT_STREAM, { clientId: id });
    this.webRTC?.deleteVideoStream(id);
  }

  connectToComputer(id: string) {
    this.room?.send(Message.CONNECT_TO_COMPUTER, { computerId: id });
  }

  disconnectFromComputer(id: string) {
    this.room?.send(Message.DISCONNECT_FROM_COMPUTER, { computerId: id });
  }

  connectToWhiteboard(id: string) {
    this.room?.send(Message.CONNECT_TO_WHITEBOARD, { whiteboardId: id });
  }

  disconnectFromWhiteboard(id: string) {
    this.room?.send(Message.DISCONNECT_FROM_WHITEBOARD, { whiteboardId: id });
  }

  onStopScreenShare(id: string) {
    this.room?.send(Message.STOP_SCREEN_SHARE, { computerId: id });
  }

  addChatMessage(content: string) {
    this.room?.send(Message.ADD_CHAT_MESSAGE, { content: content });
  }
}
