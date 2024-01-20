import { IN1Building, IPlayer } from "@/types/N1Building";
import { Client, Room } from "colyseus.js";
import WebRTC from "../_web/WebRTC";
import { phaserEvents, Event } from "../_events/event-center";
import { IRoomData, RoomType } from "@/types/Room";
import { useRoomStore } from "../_stores/use-room";
import { useUserStore } from "../_stores/use-user";

export default class Network {
  private client: Client;
  private room?: Room<IN1Building>;
  private lobby!: Room;
  webRTC?: WebRTC;

  mySessionId!: string;

  constructor() {
    const protocol = window.location.protocol.replace("http", "ws");
    const endpoint = `${protocol}//${window.location.hostname}:2567`;

    this.client = new Client(endpoint);
    this.joinLobbyRoom().then(() => {});

    phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this);
    phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this);
    phaserEvents.on(
      Event.PLAYER_DISCONNECTED,
      this.playerStreamDisconnect,
      this
    );
  }

  async joinLobbyRoom() {
    const { setAvailableRooms, addAvailableRooms, removeAvailableRooms } =
      useRoomStore((state) => state);

    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY);

    this.lobby.onMessage("rooms", (rooms) => {
      setAvailableRooms(rooms);
    });

    this.lobby.onMessage("+", ([roomId, room]) => {
      addAvailableRooms(roomId, room);
    });

    this.lobby.onMessage("-", (roomId) => {
      removeAvailableRooms(roomId);
    });
  }

  async joinOrCreatePublic() {
    this.room = await this.client.joinOrCreate(RoomType.PUBLIC);
    this.initialize();
  }

  async joinCustomById(roomId: string, password: string | null) {
    this.room = await this.client.joinById(roomId, { password });
    this.initialize();
  }

  async createCustom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData;
    this.room = await this.client.create(RoomType.CUSTOM, {
      name,
      description,
      password,
      autoDispose,
    });
    this.initialize();
  }

  initialize() {
    if (!this.room) return;

    const { setSessionId } = useUserStore((state) => state);

    this.lobby.leave();
    this.mySessionId = this.room.sessionId;
    setSessionId(this.room.sessionId);
    this.webRTC = new WebRTC(this.mySessionId, this);

    this.room.state.players.onAdd((player: IPlayer, key: string) => {
      if (key === this.mySessionId) return;
    });
  }
}
