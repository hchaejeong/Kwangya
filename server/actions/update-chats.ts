import { IN1Building } from "@/types/N1Building";
import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";

type Payload = {
    client: Client;
    content: string;
}

export default class UpdateChats extends Command<Room<IN1Building>, Payload> {
    execute(data: Payload) {
        const {client, content} = data
        const player = this.room.state.players.get(client.sessionId)
    }
}