import { ArraySchema, MapSchema, Schema, SetSchema } from "@colyseus/schema";

export interface IPlayer extends Schema {
    name: string
    x_position: string
    y_position: string
    animation: string
    readyToConnect: boolean
    videoConnected: boolean
}

export interface IComputer extends Schema {
    connectedUsers: SetSchema<string>
}

export interface IWhiteBoard extends Schema {
    connectedUsers: SetSchema<string>
}

export interface IChatting extends Schema {
    user: string
    messageSentTime: number
    content: string
}

export interface IN1Building extends Schema {
    players: MapSchema<IPlayer>
    computers: MapSchema<IComputer>
    whiteboards: MapSchema<IWhiteBoard>
    chatMessages: ArraySchema<IChatting>
}