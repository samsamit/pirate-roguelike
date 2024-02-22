import { Scene } from "phaser"
import { preloadShipSprites } from "../util/parseShipSprites"
import { autorun } from "mobx"
import { playerStore } from "../store/player.store"
import Score from "../components/shipCustomization/ShipCustomization"
import Ship2 from "../objects/ship/ship.model"
import Ship from "../objects/ship/ship.model"

class MainScene extends Scene {
  private declare ship: Ship2
  private declare cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private declare bg: Phaser.GameObjects.TileSprite

  private temp = false
  preload() {
    this.load.image("ship", "assets/ship.png")
    this.load.image("sea", "assets/seafloor.png")

    preloadShipSprites(this)
  }

  create() {
    this.bg = this.add
      .tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, "sea")
      .setOrigin(0)
      .setScrollFactor(0, 0)

    this.ship = new Ship(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      "player"
    )

    this.cameras.main.startFollow(this.ship)

    this.cursors = this.input.keyboard!.createCursorKeys()
    const button = this.add.reactDom(Score, {
      onClick: () => {
        playerStore.updateShip({ size: !this.temp ? "large" : "small" })
        this.temp = !this.temp
        console.log("Click")
      },
    })

    autorun(() => {
      this.ship.updateShip(playerStore.ship)
    })
  }

  update(time: number, delta: number) {
    this.ship.update(this.cursors)
    // Move the background opposite to player's movement
    this.bg.tilePositionX += this.ship.deltaPosition.x
    this.bg.tilePositionY += this.ship.deltaPosition.y
  }
}

export default MainScene
