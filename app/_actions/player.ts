import Phaser from "phaser"
import { PlayerBehavior } from "@/types/PlayerBehavior"

//의자에 각 포지션으로 앉을때 바뀌는 [xshift, yshift, depthshift]
export const sittingPosition = {
    up: [0, 3, -10],
    down: [0, 3, 1],
    left: [0, -8, 10],
    right: [0, -8, 10],
}

//animated player structure setting
export default class Player extends Phaser.Physics.Arcade.Sprite {
    playerId: string
    playerTexture: string
    playerBehavior = PlayerBehavior.STANDING
    readyToConnect = false
    videoConnected = false
    //room join할때 입력하는 이름을 받아서 playerName attribute에 추가
    playerName: Phaser.GameObjects.Text
    //container는 game object의 position이랑 angle을 컨트롤 해준다
    playerContainer: Phaser.GameObjects.Container
    //플레이어 위에 뜨는 말풍선 컨테이너
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
        this.playerTexture = texture

        this.setDepth(this.y)
        //.anims이 sprite에 애니메이션을 추가해주는 부분
        this.anims.play(`${this.playerTexture}_idle_down`, true)

        //플레이어 오브젝트를 띄워줄때 container로 플레이어 크기만큼 지정해눠서 띄워줘야함
        //player가 맵에서 항상 가장 위에 있는 layer에서 보여야하니까 큰 숫자로 depth설정해주자
        this.playerContainer = this.scene.add.container(this.x, this.y).setDepth(5000)
        this.playerDialogBubble = this.scene.add.container(0, 0).setDepth(5000)
        //플레이어 오브젝트랑 말풍선이 같이 움직이면서 띄워져야하니까 playerContainer에 dialogbubble container 추가시키기
        this.playerContainer.add(this.playerDialogBubble)

        //플레이어 이름도 플레이어가 움직이면서 같이 따라다녀야 하니까 container에 추가시키기
        this.playerName = this.scene.add
            .text(0, 0, '')
            .setColor('#000000')
            .setFontFamily('Arial')
            .setFontSize(11)
        this.playerContainer.add(this.playerName)

        //플레이어 container가 다른 부분들과 collision이 있을때 필요한 코드
        this.scene.physics.world.enable(this.playerContainer)
        const containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body
        containerBody.setSize(this.width * 0.5, this.height * 0.2).setOffset(-8, this.height * (0.8) + 6)
    }

    async updatePlayerDialog(message: string) {
        this.resetPlayerDialog()

        const dialogMessage = this.scene.add.text(0, 0, message, { wordWrap: { width: 150, useAdvancedWrap: true }})
            .setColor('#000000').setFontFamily('Arial').setFontSize(11)
        
        const textWidth = dialogMessage.width
        const textHeight = dialogMessage.height
        const bubbleWidth = textWidth + 10
        const bubbleHeight = textHeight + 3

        //텍스트를 감싸는 네모상자 부분을 추가
        this.playerDialogBubble.add(
            this.scene.add.graphics().fillStyle(0xffffff, 1).lineStyle(1, 0x000000, 1)
                .fillRoundedRect(dialogMessage.x - (textWidth / 2) - 5, dialogMessage.y - (textHeight / 2) - 2, bubbleWidth, bubbleHeight, 3)
                .strokeRoundedRect(dialogMessage.x - (textWidth / 2) - 5, dialogMessage.y - (textHeight / 2) - 2, bubbleWidth, bubbleHeight, 3)
        )
        //실제 텍스트를 bubble에 추가하기
        this.playerDialogBubble.add(dialogMessage)

        this.timeout = window.setTimeout(() => {
            this.resetPlayerDialog()
          }, 6000)
    }

    async resetPlayerDialog() {
        clearTimeout(this.timeout)
        this.playerDialogBubble.removeAll(true)
    }
}