import * as Phaser from "phaser";
import { BackgroundMode } from "@/types/BackgroundMode";
import Network from "../_services/network";
import store from "../_stores";
import { setRoomJoined } from "../_stores/RoomStore";

export default class Bootstrap extends Phaser.Scene {
  private preloadComplete = false;
  network!: Network;

  constructor() {
    super("bootstrap");
  }

  //경로를 바꿔야할지...
  preload() {
    this.load.atlas(
      "cloud_day",
      "@/public/assets/background/cloud_day.png",
      "@/public/assets/background/cloud_day.json"
    );
    this.load.image(
      "backdrop_day",
      "@/public/assets/background/backdrop_day.png"
    );
    this.load.atlas(
      "cloud_night",
      "@/public/assets/background/cloud_night.png",
      "@/public/assets/background/cloud_night.json"
    );
    this.load.image(
      "backdrop_night",
      "@/public/assets/background/backdrop_night.png"
    );
    this.load.image("sun_moon", "@/public/assets/background/sun_moon.png");

    this.load.tilemapTiledJSON("tilemap", "@/public/assets/map/map.json");
    this.load.spritesheet(
      "tiles_wall",
      "@/public/assets/map/FloorAndGround.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet("chairs", "@/public/assets/items/chair.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("computers", "@/public/assets/items/computer.png", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet(
      "whiteboards",
      "@/public/assets/items/whiteboard.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    this.load.spritesheet(
      "vendingmachines",
      "@/public/assets/items/vendingmachine.png",
      {
        frameWidth: 48,
        frameHeight: 72,
      }
    );
    this.load.spritesheet(
      "office",
      "@/public/assets/tileset/Modern_Office_Black_Shadow.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet("basement", "@/public/assets/tileset/Basement.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("generic", "@/public/assets/tileset/Generic.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("adam", "@/public/assets/character/adam.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("ash", "@/public/assets/character/ash.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("lucy", "@/public/assets/character/lucy.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("nancy", "@/public/assets/character/nancy.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    const currentHour = new Date().getHours();
    const backgroundMode =
      currentHour > 6 && currentHour <= 18
        ? BackgroundMode.DAY
        : BackgroundMode.NIGHT;
    this.load.on("complete", () => {
      this.preloadComplete = true;
      this.launchBackground(backgroundMode);
    });
  }

  init() {
    this.network = new Network();
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch("background", { backgroundMode });
  }

  launchGame() {
    if (!this.preloadComplete) return;
    this.network.webRTC?.checkPreviousPermission();
    this.scene.launch("game", {
      network: this.network,
    });

    // update Redux state
    store.dispatch(setRoomJoined(true));
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop("background");
    this.launchBackground(backgroundMode);
  }
}
