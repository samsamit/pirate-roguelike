export const smallShip = {
  key: "small_ship",
  url: "assets/ship/small_ship.png",
  frameConfig: {
    frameWidth: 63,
    frameHeight: 32,
    startFrame: 0,
    endFrame: 18,
  },
} as const satisfies Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig

export const mediumShip = {
  key: "medium_ship",
  url: "assets/ship/medium_ship.png",
  frameConfig: {
    frameWidth: 80,
    frameHeight: 44,
    startFrame: 0,
    endFrame: 15,
  },
} as const satisfies Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig

export const largeShip = {
  key: "large_ship",
  url: "assets/ship/large_ship.png",
  frameConfig: {
    frameWidth: 128,
    frameHeight: 46,
    startFrame: 0,
    endFrame: 15,
  },
} as const satisfies Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig

export const mast = {
  key: "ship_mast",
  url: "assets/ship/ship_mast.png",
  frameConfig: {
    frameWidth: 32,
    frameHeight: 32,
    startFrame: 0,
    endFrame: 23,
  },
} as const satisfies Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig

export const sails = {
  key: "ship_sails",
  url: "assets/ship/ship_sails.png",
  frameConfig: {
    frameWidth: 32,
    frameHeight: 32,
    startFrame: 50,
    endFrame: 71,
  },
} as const satisfies Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig

export const smallSails = {
  key: "ship_small_sails",
  url: "assets/ship/ship_small_sails.png",
  frameConfig: {
    frameWidth: 32,
    frameHeight: 20,
    startFrame: 0,
    endFrame: 24,
  },
} as const satisfies Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig

export const cannons = {
  key: "ship_cannons",
  url: "assets/ship/ship_cannon.png",
  frameConfig: {
    frameWidth: 15,
    frameHeight: 15,
    startFrame: 0,
    endFrame: 11,
  },
} as const satisfies Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig

export const smallCannon = {
  key: "ship_small_cannon",
  url: "assets/ship/ship_small_cannon.png",
  frameConfig: {
    frameWidth: 8,
    frameHeight: 10,
    startFrame: 0,
    endFrame: 3,
  },
} as const satisfies Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig

export const shipsSprites = [
  smallShip,
  mediumShip,
  largeShip,
  mast,
  sails,
  smallSails,
  cannons,
  smallCannon,
]
export function preloadShipSprites(scene: Phaser.Scene) {
  shipsSprites.forEach((sprite) => scene.load.spritesheet(sprite))
}

export function testShipSprites(scene: Phaser.Scene) {
  //small ships
  shipsSprites.forEach((sprite, i) => {
    for (let j = 0; j < sprite.frameConfig.endFrame; j++) {
      scene.add.image(
        50 + (sprite.frameConfig.frameWidth + 10) * j,
        50 + (110 * i) / 1.2,
        sprite.key,
        j
      )
    }
  })

  scene.anims.create({
    key: "ship_cannon",
    frames: scene.anims.generateFrameNames("ship_cannons", {
      frames: [9, 10, 11, 9],
    }),
    repeat: -1,
  })

  scene.add.sprite(400, 400, "ship_cannons").play({
    key: "ship_cannon",
    repeatDelay: 500,
    frameRate: 8,
  })
}
