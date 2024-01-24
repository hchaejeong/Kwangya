import { IN1Building } from "@/types/N1Building";
import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";

type Payload = {
  client: Client;
  x: number;
  y: number;
  anim: string;
};

export default class PlayerEnterCommand extends Command<IN1Building, Payload> {
  execute(data: Payload) {
    const { client, x, y, anim } = data;

    const player = this.room.state.players.get(client.sessionId);
    if (!player) {
      return;
    }
    player.x = x;
    player.y = y;
    player.anim = anim;
  }
}
