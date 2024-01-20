import { Items } from "@/types/Items";
import { NavKeys } from "@/types/Keyboard";
import { PlayerBehavior } from "@/types/PlayerBehavior";
import Player from "./player";

export const sittingPosition = {
    up: [0, 3, -10],
    down: [0, 3, 1],
    left: [0, -8, 10],
    right: [0, -8, 10],
}

export class PlayerAnimationLoop extends Phaser.GameObjects.Zone {
    item?: Items
    

    update(player: Player, cursors: NavKeys): void {
        //a player that is sitting down does not need animation
        if (player.playerBehavior == PlayerBehavior.SITTING) {
            return
        }

        
    }
}
