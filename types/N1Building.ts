import { ArraySchema, MapSchema, Schema, SetSchema } from "@colyseus/schema";

export interface IPlayer extends Schema {
  name: string;
  x: number;
  y: number;
  anim: string;
  readyToConnect: boolean;
  videoConnected: boolean;
}

export interface IComputer extends Schema {
  connectedUsers: SetSchema<string>;
}

export interface IWhiteBoard extends Schema {
  roomId: string;
  connectedUsers: SetSchema<string>;
}

export interface IChatting extends Schema {
  user: string;
  messageSentTime: number;
  content: string;
}

export interface IN1Building extends Schema {
  players: MapSchema<IPlayer>;
  computers: MapSchema<IComputer>;
  whiteboards: MapSchema<IWhiteBoard>;
  chatMessages: ArraySchema<IChatting>;
}
