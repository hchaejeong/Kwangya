import {
  IChatting,
  IComputer,
  IN1Building,
  IPlayer,
  IWhiteBoard,
} from "@/types/N1Building";
import {
  ArraySchema,
  MapSchema,
  Schema,
  SetSchema,
  type,
} from "@colyseus/schema";

import { v4 as uuidv4 } from "uuid";

export class Player extends Schema implements IPlayer {
  @type("string") name = "";
  @type("number") x = 705;
  @type("number") y = 500;
  @type("string") anim = "adam_idle_down";
  @type("boolean") readyToConnect = false;
  @type("boolean") videoConnected = false;
}

export class Computer extends Schema implements IComputer {
  @type({ set: "string" }) connectedUsers = new SetSchema<string>();
}

export class WhiteBoard extends Schema {
  @type("string") roomId = getUniqueRoomId();
  @type({ set: "string" }) connectedUsers = new SetSchema<string>();
}

export class Chatting extends Schema implements IChatting {
  @type("string") user = "";
  @type("number") messageSentTime = new Date().getTime();
  @type("string") content = "";
}

export class N1Building extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Computer }) computers = new MapSchema<Computer>();
  @type({ map: WhiteBoard }) whiteboards = new MapSchema<WhiteBoard>();
  @type({ array: Chatting }) chatMessages = new ArraySchema<Chatting>();
}

export const existingRoomIds = new Set<string>();

//generating a new unique room id for the whiteboard since each the content in each whiteboard must be preserved
function getUniqueRoomId() {
  const roomId = uuidv4().substr(0, 12);
  if (!existingRoomIds.has(roomId)) {
    existingRoomIds.add(roomId);
    return roomId;
  } else {
    console.log("roomId exists, make a new roomId.");
    getUniqueRoomId();
  }
}
