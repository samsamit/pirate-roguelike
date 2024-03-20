import { Scene } from "phaser"
import { preloadShipSprites } from "../util/parseShipSprites"
import { playerStore } from "../store/player.store"
import Score, {
  IScore,
} from "../components/shipCustomization/ShipCustomization"
import Player from "../objects/player.model"
import EnemyHandler from "../objects/enemyHandler.model"
import { initGlobalAnimations } from "../util/animations"
import UiContainer from "../components/uiContainer"

export type WasdKeys = {
  W: Phaser.Input.Keyboard.Key
  A: Phaser.Input.Keyboard.Key
  S: Phaser.Input.Keyboard.Key
  D: Phaser.Input.Keyboard.Key
}
class MainScene extends Scene {
  private declare player: Player
  private declare cursors: WasdKeys
  private declare background: Phaser.GameObjects.TileSprite
  private declare enemyHandler: EnemyHandler

  preload() {
    this.load.image("sea", "assets/seafloor.png")
    this.load.image("projectile", "assets/ship/cannon_ball.png")
    preloadShipSprites(this)
  }

  create() {
    initGlobalAnimations(this)
    this.background = this.add
      .tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, "sea")
      .setOrigin(0)
      .setScrollFactor(0, 0)

    this.player = new Player(this)
    this.enemyHandler = new EnemyHandler(this)

    this.cursors = this.input.keyboard!.addKeys("W,S,A,D") as WasdKeys

    // this.add.reactDom(Score, {
    //   onClick: (size) => {
    //     playerStore.updateShip({ size })
    //   },
    // } satisfies IScore)

    this.add.reactDom(UiContainer)
  }

  update(time: number, delta: number) {
    this.player.update(this.background, this.cursors)
    this.enemyHandler.update(time, this.player.position)
  }
}

export default MainScene
