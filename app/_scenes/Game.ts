import * as Phaser from "phaser";
import { createCharacterAnims } from "../_actions/character_animations";
import { Keyboard, NavKeys } from "@/types/Keyboard";
import MyPlayer from "../_actions/my_player";
import { PlayerMovement } from "../_actions/player_movement";
import Network from "../_services/network";
import OtherPlayer from "../_actions/other_player";
import { IPlayer } from "@/types/N1Building";

export default class Game extends Phaser.Scene {
    network!: Network
    myPlayer!: MyPlayer
    private otherPlayers!: Phaser.Physics.Arcade.Group
    private otherPlayerMap = new Map<string, OtherPlayer>()
    private cursors!: NavKeys
    private keyE!: Phaser.Input.Keyboard.Key
    private keyR!: Phaser.Input.Keyboard.Key
    private map!: Phaser.Tilemaps.Tilemap
    private playerSelector!: Phaser.GameObjects.Zone

    constructor() {
        super('game')
    }

    registerKeys() {
        const cursorKeys = this.input.keyboard?.createCursorKeys()
        const customKeys = this.input.keyboard?.addKeys('W,S,A,D') as Keyboard

        this.cursors = {
            W: customKeys.W,
            S: customKeys.S,
            A: customKeys.A,
            D: customKeys.D,
            up: cursorKeys?.up!,
            down: cursorKeys?.down!,
            left: cursorKeys?.left!,
            right: cursorKeys?.right!,
            space: cursorKeys?.space!,
            shift: cursorKeys?.shift!,
        };

        //추가로 사용할 key들 정의해줌
        this.keyE = this.input.keyboard?.addKey('E')!;
        this.keyR = this.input.keyboard?.addKey('R')!;

        this.input.keyboard?.disableGlobalCapture()
        //여기서 chatting할때 쓰는 enter랑 esc를 또 정의해준다
    }

    disableKeys() {
        if (this.input.keyboard) {
            this.input.keyboard.enabled = false
        }
    }

    enableKeys() {
        if (this.input.keyboard) {
            this.input.keyboard.enabled = true
        }
    }

    //object들 생성하고 배치해야한다
    create(data: { network: Network }) {
        if (!data.network) {
            throw new Error('no server instance')
        } else {
            this.network = data.network
        }

        createCharacterAnims(this.anims)

        //실제 게임 맵에 사용될 타일 맵을 먼저 깔아야함 map.json에서 tilemap 부분을 가져와서 렌더링
        //1. make tilemap을 사용해서 기본 맵을 깔아주고 2. 이 맵에서 사용될 실제 타일 이미지들을 불러오기 3. 레이어를 만들어서 씌워주기
        this.map = this.make.tilemap({ key: 'tilemap' })
        //(tilemap으로 쓸 이미지 파일 이름, 우리가 정해주는 이 타일 부분의 이름 key)
        const tileset = this.map.addTilesetImage('FloorAndGround', 'Tiles')
        if (tileset) {
            const ground = this.map.createLayer('Ground', tileset)
            ground?.setCollisionByProperty({ collides: true })

            if (ground) {
                this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], ground)
            }
            //안 움직이는 built in object group을 다 추가 (벽, 오피스 아이템들, 등)
            this.addStaticGroupElements('Wall', 'tiles_wall', 'FloorAndGround', false)
            this.addStaticGroupElements('Objects', 'office', 'Modern_Office_Black_Shadow', false)
            this.addStaticGroupElements('ObjectsOnCollide', 'office', 'Modern_Office_Black_Shadow', true)
            this.addStaticGroupElements('GenericObjects', 'generic', 'Generic', false)
            this.addStaticGroupElements('GenericObjectsOnCollide', 'generic', 'Generic', true)
            this.addStaticGroupElements('Basement', 'basement', 'Basement', true)
        }

        this.myPlayer = this.add.myPlayer(700, 500, 'adam', this.network.mysessionId)
        this.playerSelector = new PlayerMovement(this, 0, 0, 16, 16)

        this.cameras.main.zoom = 1.5
        this.cameras.main.startFollow(this.myPlayer, true)

        //각 아이템들 추가 필요 (의자, 컴퓨터, 화이트보드, 커피머신)
        //this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], vendingMachines)


        this.otherPlayers = this.physics.add.group({ classType: OtherPlayer })

        //내 플레이어랑 아이템들 (컴퓨터, 화이트보드, 의자, 커피머신)이랑 다른 플레이어들과는 collide 말고 overlap 시킨다
        //this.physics.add.overlap(this.playerSelector, [chairs, computers, whiteboards, coffee])
        this.physics.add.overlap(this.playerSelector, this.otherPlayers, this.handlePlayersOverlap, undefined, this)
    
        this.network.onPlayerJoined(this.handlePlayerJoined, this)
        this.network.onPlayerLeft(this.handlePlayerLeft, this)
        this.network.onMyPlayerReady(this.handleMyPlayerReady, this)
        this.network.onMyPlayerVideoConnected(this.handleMyPlayerConnected, this)
        this.network.onPlayerUpdated(this.handlePlayerUpdated, this)
        //this.network.onItemUserAdded(this.handleItemUserAdded, this)
       // this.network.onItemUserRemoved(this.handleItemUserRemoved, this)
        //this.network.onChatMessageAdded(this.handleChatMessageAdded, this)
    }

    private handlePlayersOverlap(myPlayer: any, otherPlayer: any) {
        otherPlayer.makeCall(myPlayer, this.network?.webRTC)
    }

    private addStaticGroupElements( objectName: string, key: string, tilesetName: string, collideWithPlayer: boolean) {
        const staticGroup = this.physics.add.staticGroup()
        //object 이름으로 찾고 싶은 object을 맵에서 다 불러온다
        const objectLayer = this.map.getObjectLayer(objectName)
        objectLayer?.objects.forEach((object) => {
            //실제 x,y좌표를 중간값으로 설정하면 실제 object의 위치
            const x_position = object.x! + object.width! * 0.5
            const y_position = object.y! - object.height! * 0.5
            const tileset = this.map.getTileset(tilesetName)
            if (tileset) {
                const firstGid = tileset.firstgid;
                staticGroup.get(x_position, y_position, key, object.gid! - firstGid).setDepth(y_position)
            } else {
                console.log(`Tileset '${tilesetName}' not found`)
            }
        })

        //지금 플레이어가 방에 들어와있고 object이 충돌되는 오브젝트 그룹이면 서로 겹치지 않고 밀어내도록 구현
        if (this.myPlayer && collideWithPlayer) {
            this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], staticGroup)
        }
    }

    private handlePlayerJoined(newPlayer: IPlayer, id: string) {
        const otherPlayer = this.add.otherPlayer(newPlayer.x, newPlayer.y, 'adam', id, newPlayer.name)
        this.otherPlayers.add(otherPlayer)
        this.otherPlayerMap.set(id, otherPlayer)
    }

    //현재 플레이어가 연결된 다른 플레이어 리스트에서 제거
    private handlePlayerLeft(id: string) {
        if (this.otherPlayerMap.has(id)) {
            const otherPlayer = this.otherPlayerMap.get(id)
            if (!otherPlayer) return
            this.otherPlayers.remove(otherPlayer, true, true)
            this.otherPlayerMap.delete(id)
        }
    }

    private handleMyPlayerReady() {
        this.myPlayer.readyToConnect = true
    }

    private handleMyPlayerConnected() {
        this.myPlayer.videoConnected = true
    }

    private handlePlayerUpdated(field: string, value: number | string | boolean, id: string) {
        const otherPlayer = this.otherPlayerMap.get(id)
        otherPlayer?.updatePlayer(field, value)
    }

    update(time: number, delta: number): void {
        //현재 네트워크가 연결되어있고 플레이어가 최소 한명 존재할때만 업데이트
        if (this.myPlayer && this.network) {
            //현재 쓰이고 있는 key들에 따른 플레이어 움직임 업데이트
            this.playerSelector.update(this.myPlayer, this.cursors)
            this.myPlayer.update(this.playerSelector, this.cursors, this.keyE, this.keyR, this.network)
        }
    }
}