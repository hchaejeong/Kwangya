import Phaser from "phaser"
import { PlayerBehavior } from "@/types/PlayerBehavior"

//generate animated player
export default class Player extends Phaser.Physics.Arcade.Sprite {
    playerId: string
    playerTexture: string
    playerBehavior: PlayerBehavior.STANDING
    readyToConnect = false
    videoConnected = false
    playerName: Phaser.GameObjects.Text
    playerContainer: Phaser.GameObjects.Container
    private playerDialogBubble: Phaser.GameObjects.Container
    private timeout?: number

    constructor(
        scene: Phaser.Scene,
        x_position: number,
        y_position: number,
        texture: string,
        id: string,
        frame?: string | number
    ) {
        super(scene, x_position, y_position, texture, frame)
        this.playerId = id
        this.playerTexture = texture,
        this.playerBehavior 
    }
}