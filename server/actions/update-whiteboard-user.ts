import { IN1Building } from "@/types/N1Building";
import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";

type Payload = {
  client: Client;
  whiteboardId: string;
};

export class WhiteboardAddUser extends Command<IN1Building, Payload> {
  execute(data: Payload) {
    const { client, whiteboardId } = data;
    const whiteboard = this.room.state.whiteboards.get(whiteboardId);
    const clientId = client.sessionId;

    if (!whiteboard || whiteboard.connectedUsers.has(clientId)) return;
    whiteboard.connectedUsers.add(clientId);
  }
}

export class WhiteboardRemoveUser extends Command<IN1Building, Payload> {
  execute(data: Payload) {
    const { client, whiteboardId } = data;
    const whiteboard = this.state.whiteboards.get(whiteboardId);

    if (whiteboard?.connectedUsers.has(client.sessionId)) {
      whiteboard.connectedUsers.delete(client.sessionId);
    }
  }
}
