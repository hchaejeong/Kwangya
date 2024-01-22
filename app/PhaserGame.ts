"use client";

import * as Phaser from "phaser";
import Background from "./_scenes/Background";
import Bootstrap from "./_scenes/Bootstrap";
import Game from "./_scenes/Game";

/*
type: 게임 렌더링 엔진을 설정합니다. Phaser.AUTO는 자동으로 WebGL 또는 Canvas를 선택합니다.
parent: 게임이 렌더링될 HTML 요소의 ID를 지정합니다. 여기서는 'phaser-container'라는 ID를 가진 요소에 게임이 렌더링됩니다.
backgroundColor: 게임의 배경 색상을 설정합니다. 여기서는 #93cbee로 지정되어 있습니다.
pixelArt: 픽셀 아트를 사용할 때 크기를 조절할 때 흐릿하게 되는 것을 방지하기 위해 true로 설정합니다.
scale: 게임의 크기 및 스케일 모드를 설정합니다. 여기서는 RESIZE 모드로 지정되어 있고, 너비와 높이는 브라우저 창의 크기로 설정되어 있습니다.
physics: 게임에서 사용할 물리 엔진을 설정합니다. 여기서는 'arcade'를 사용하고, 중력은 y 축으로 작용하지 않도록 설정되어 있습니다. 디버그 모드는 비활성화되어 있습니다.
autoFocus: 페이지가 로드될 때 자동으로 게임에 포커스를 설정할지 여부를 나타냅니다.
scene: 게임에 포함될 씬(Scene)을 정의합니다. 여기서는 Background라는 씬이 정의되어 있습니다. Phaser에서 씬은 게임의 특정 부분이나 화면을 나타냅니다.
*/

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#93cbee",
  pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  autoFocus: true,
  scene: [Bootstrap, Background, Game],
};

const phaserGame = new Phaser.Game(config);

(window as any).game = phaserGame;

export default phaserGame;
