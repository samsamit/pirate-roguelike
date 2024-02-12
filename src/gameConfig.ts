import MainScene from "./scenes/main.scene"

const gameConfig = {
  parent: "game-canvas" as string,
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  clearBeforeRender: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: [MainScene],
} as const satisfies Phaser.Types.Core.GameConfig

export default gameConfig
