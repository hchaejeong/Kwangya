import { BackgroundMode } from "@/types/BackgroundMode";
import * as Phaser from "phaser";

export default class Background extends Phaser.Scene {
  private cloud!: Phaser.Physics.Arcade.Group;
  private cloudKey!: string;
  private backdropKey!: string;

  constructor() {
    super("background");
  }

  create(data: { backgroundMode: BackgroundMode }) {
    const sceneHeight = this.cameras.main.height;
    const sceneWidth = this.cameras.main.width;

    // set texture of images based on the background mode
    if (data.backgroundMode === BackgroundMode.DAY) {
      this.backdropKey = "backdrop_day";
      this.cloudKey = "cloud_day";
      this.cameras.main.setBackgroundColor("#c6eefc");
    } else {
      this.backdropKey = "backdrop_night";
      this.cloudKey = "cloud_night";
      this.cameras.main.setBackgroundColor("#2c4464");
    }

    // Add backdrop image on center of the window (sceneWidth/2, sceneHeight/2)
    const backdropImage = this.add.image(
      sceneWidth / 2,
      sceneHeight / 2,
      this.backdropKey
    );
    const scale = Math.max(
      sceneWidth / backdropImage.width,
      sceneHeight / backdropImage.height
    );
    backdropImage.setScale(scale).setScrollFactor(0); //setScrollFactor(0): 이미지가 카메라의 스크롤에 영향을 받지 않음

    // Add sun or moon image
    const sunMoonImage = this.add.image(
      sceneWidth / 2,
      sceneHeight / 2,
      "sun_moon"
    );
    const scale2 = Math.max(
      sceneWidth / sunMoonImage.width,
      sceneHeight / sunMoonImage.height
    );
    sunMoonImage.setScale(scale2).setScrollFactor(0);

    // Add 24 clouds at random positions and with random speeds
    const frames = this.textures.get(this.cloudKey).getFrameNames();
    this.cloud = this.physics.add.group(); //구름에 대한 group 생성
    for (let i = 0; i < 24; i++) {
      //window의 random position에 구름 생성
      const x = Phaser.Math.RND.between(-sceneWidth * 0.5, sceneWidth * 1.5);
      const y = Phaser.Math.RND.between(sceneHeight * 0.2, sceneHeight * 0.8);
      const velocity = Phaser.Math.RND.between(15, 30); //random velocity

      //add a cloud to the cloud group
      this.cloud
        .get(x, y, this.cloudKey, frames[i % 6]) //frames[i % 6] 구름이 사용할 이미지 프레임을 순환하여 선택
        .setScale(3)
        .setVelocity(velocity, 0);
    }
  }

  //if a cloud goes outside the window, move it to the window again
  update(t: number, dt: number) {
    this.physics.world.wrap(this.cloud, 500); // get in the window 5ms
  }
}
