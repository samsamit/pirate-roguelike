import { smallCannon } from "./parseShipSprites"

export const GlobalAnimations = {
  smallCannon: "smallCannon_animation",
  explosion: "explosion",
  emptyExplosion: "emptyExplosion",
}

export const initGlobalAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: GlobalAnimations.smallCannon,
    frames: scene.anims.generateFrameNames(smallCannon.key, {
      frames: [0, 1, 2, 0],
    }),
    frameRate: 10,
    repeat: 0,
  })

  scene.anims.create({
    key: GlobalAnimations.explosion,
    frames: scene.anims.generateFrameNames("explosion", {
      frames: [4, 5, 6, 7],
    }),
    frameRate: 10,
    repeat: 0,
    hideOnComplete: true,
  })

  scene.anims.create({
    key: GlobalAnimations.emptyExplosion,
    frames: scene.anims.generateFrameNames("explosion", {
      frames: [0, 1, 2, 3],
    }),
    frameRate: 10,
    repeat: 0,
    hideOnComplete: true,
  })
}
