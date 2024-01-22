import { IN1Building } from "@/types/N1Building"
import { Command } from "@colyseus/command"
import { Client, Room } from "colyseus"

type Payload = {
    client: Client
    name: string
    x: number
    y: number
    anim: string
}

export default class PlayerEnterCommand extends Command<Room<IN1Building>, Payload> {
    execute(data: Payload) {
        const { client, name, x, y, anim } = data

        const player = this.room.state.players.get(client.sessionId)
        if (!player) { return }
        player.name = name
        player.x = x
        player.y = y
        player.anim = anim
    }
}