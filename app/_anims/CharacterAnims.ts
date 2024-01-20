import * as Phaser from "phaser";

export const createCharacterAnims = (
  anims: Phaser.Animations.AnimationManager
) => {
  /*
  createCharacterAnims 함수 시그니처: 함수는 anims라는 이름의 매개변수를 받습니다. 이 anims는 Phaser에서 애니메이션을 관리하는 데 사용되는 AnimationManager 객체입니다.
  animsFrameRate 변수: animsFrameRate는 애니메이션의 프레임 속도를 나타내는 변수로, 15로 초기화되어 있습니다. 이 값은 애니메이션의 각 프레임이 표시되는 속도를 조절하는 데 사용됩니다.
  anims.create 메서드: anims.create는 Phaser에서 애니메이션을 생성하는 메서드입니다. 여기서는 'nancy_idle_right'라는 키로 애니메이션을 생성하고 있습니다.
  frames 속성: generateFrameNames 함수를 사용하여 애니메이션에 사용될 프레임들의 이름을 생성합니다. 'nancy' 스프라이트 시트에서 0부터 5까지의 프레임을 사용하고 있습니다.
  repeat 속성: repeat는 애니메이션이 끝난 후에 몇 번 반복될지를 나타냅니다. 여기서는 -1로 설정되어 무한 반복됩니다.
  frameRate 속성: frameRate는 애니메이션의 프레임 속도를 설정합니다. animsFrameRate 변수의 60%로 설정되어 있습니다.
  */

  const animsFrameRate = 15;

  anims.create({
    key: "nancy_idle_right",
    frames: anims.generateFrameNames("nancy", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "nancy_idle_up",
    frames: anims.generateFrameNames("nancy", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "nancy_idle_left",
    frames: anims.generateFrameNames("nancy", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "nancy_idle_down",
    frames: anims.generateFrameNames("nancy", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "nancy_run_right",
    frames: anims.generateFrameNames("nancy", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "nancy_run_up",
    frames: anims.generateFrameNames("nancy", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "nancy_run_left",
    frames: anims.generateFrameNames("nancy", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "nancy_run_down",
    frames: anims.generateFrameNames("nancy", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "nancy_sit_down",
    frames: anims.generateFrameNames("nancy", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "nancy_sit_left",
    frames: anims.generateFrameNames("nancy", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "nancy_sit_right",
    frames: anims.generateFrameNames("nancy", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "nancy_sit_up",
    frames: anims.generateFrameNames("nancy", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "lucy_idle_right",
    frames: anims.generateFrameNames("lucy", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "lucy_idle_up",
    frames: anims.generateFrameNames("lucy", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "lucy_idle_left",
    frames: anims.generateFrameNames("lucy", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "lucy_idle_down",
    frames: anims.generateFrameNames("lucy", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "lucy_run_right",
    frames: anims.generateFrameNames("lucy", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "lucy_run_up",
    frames: anims.generateFrameNames("lucy", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "lucy_run_left",
    frames: anims.generateFrameNames("lucy", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "lucy_run_down",
    frames: anims.generateFrameNames("lucy", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "lucy_sit_down",
    frames: anims.generateFrameNames("lucy", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "lucy_sit_left",
    frames: anims.generateFrameNames("lucy", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "lucy_sit_right",
    frames: anims.generateFrameNames("lucy", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "lucy_sit_up",
    frames: anims.generateFrameNames("lucy", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ash_idle_right",
    frames: anims.generateFrameNames("ash", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ash_idle_up",
    frames: anims.generateFrameNames("ash", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ash_idle_left",
    frames: anims.generateFrameNames("ash", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ash_idle_down",
    frames: anims.generateFrameNames("ash", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "ash_run_right",
    frames: anims.generateFrameNames("ash", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ash_run_up",
    frames: anims.generateFrameNames("ash", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ash_run_left",
    frames: anims.generateFrameNames("ash", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ash_run_down",
    frames: anims.generateFrameNames("ash", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ash_sit_down",
    frames: anims.generateFrameNames("ash", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ash_sit_left",
    frames: anims.generateFrameNames("ash", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ash_sit_right",
    frames: anims.generateFrameNames("ash", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "ash_sit_up",
    frames: anims.generateFrameNames("ash", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "adam_idle_right",
    frames: anims.generateFrameNames("adam", {
      start: 0,
      end: 5,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "adam_idle_up",
    frames: anims.generateFrameNames("adam", {
      start: 6,
      end: 11,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "adam_idle_left",
    frames: anims.generateFrameNames("adam", {
      start: 12,
      end: 17,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "adam_idle_down",
    frames: anims.generateFrameNames("adam", {
      start: 18,
      end: 23,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  });

  anims.create({
    key: "adam_run_right",
    frames: anims.generateFrameNames("adam", {
      start: 24,
      end: 29,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "adam_run_up",
    frames: anims.generateFrameNames("adam", {
      start: 30,
      end: 35,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "adam_run_left",
    frames: anims.generateFrameNames("adam", {
      start: 36,
      end: 41,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "adam_run_down",
    frames: anims.generateFrameNames("adam", {
      start: 42,
      end: 47,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "adam_sit_down",
    frames: anims.generateFrameNames("adam", {
      start: 48,
      end: 48,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "adam_sit_left",
    frames: anims.generateFrameNames("adam", {
      start: 49,
      end: 49,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "adam_sit_right",
    frames: anims.generateFrameNames("adam", {
      start: 50,
      end: 50,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });

  anims.create({
    key: "adam_sit_up",
    frames: anims.generateFrameNames("adam", {
      start: 51,
      end: 51,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  });
};
