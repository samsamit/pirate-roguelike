import MainScene from "./scenes/main.scene"
import phaserReact from "phaser3-react"

const gameConfig: Phaser.Types.Core.GameConfig = {
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
  dom: {
    createContainer: true,
  },
  plugins: {
    global: [
      {
        key: "phaser-react",
        plugin: phaserReact,
        start: true,
      },
    ],
  },
}

export default new Phaser.Game(gameConfig)
