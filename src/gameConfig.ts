import MainScene from "./scenes/main.scene"

const gameConfig = {
  parent: "game-canvas",
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  clearBeforeRender: true,
  physics: {
    default: "matter",
    matter: {
      debug: true,
      enableSleeping: true,
      gravity: {
        x: 0,
        y: 0,
      },
    },
  },
  scene: [MainScene],
  input: true,
} as const satisfies Phaser.Types.Core.GameConfig

export default gameConfig
