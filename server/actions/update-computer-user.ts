import { IN1Building } from "@/types/N1Building";
import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";

type Payload = {
  client: Client;
  computerId: string;
};

export class ComputerAddUser extends Command<IN1Building, Payload> {
  execute(data: Payload) {
    const { client, computerId } = data;
    const computer = this.room.state.computers.get(computerId);
    const clientId = client.sessionId;

    if (!computer || computer.connectedUsers.has(clientId)) return;

    computer.connectedUsers.add(clientId);
  }
}

export class ComputerRemoveUser extends Command<IN1Building, Payload> {
  execute(data: Payload) {
    const { client, computerId } = data;
    const computer = this.state.computers.get(computerId);

    if (computer?.connectedUsers.has(client.sessionId)) {
      computer.connectedUsers.delete(client.sessionId);
    }
  }
}
