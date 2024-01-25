import { IN1Building } from "@/types/N1Building";
import { Command } from "@colyseus/command";
import { Client, Room } from "colyseus";
import { Chatting } from "../rooms/schema/RoomState";

type Payload = {
  client: Client;
  content: string;
};

export default class UpdateChats extends Command<IN1Building, Payload> {
  //add new chat to the room's chat list
  execute(data: Payload) {
    const { client, content } = data;
    const player = this.room.state.players.get(client.sessionId);
    const chatMessages = this.room.state.chatMessages;

    if (!chatMessages || !player) return;

    if (chatMessages.length >= 100) chatMessages.shift();

    const newMessage = new Chatting();

    newMessage.user = player.name;
    newMessage.content = content;
    chatMessages.push(newMessage);
  }
}
