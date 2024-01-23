import { IN1Building } from "@/types/N1Building";
import { Client } from "colyseus";
import { Command } from "@colyseus/command";
import { Room } from "colyseus";

type Payload = {
  client: Client;
  name: string;
};

export default class PlayerUpdateNameCommand extends Command<
  Room<IN1Building>,
  Payload
> {
  execute(data: Payload) {
    const { client, name } = data;
    const player = this.room.state.players.get(client.sessionId);
    if (!player) return;
    player.name = name;
  }
}
