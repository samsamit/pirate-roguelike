import { Scene } from "phaser"
import { Ship } from "../objects/ship/ship.model"
import { preloadShipSprites } from "../util/parseShipSprites"
import { autorun } from "mobx"
import { playerStore } from "../store/player.store"
import Score from "../components/shipCustomization/ShipCustomization"

class MainScene extends Scene {
  private declare ship: Ship
  private declare cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private declare bg: Phaser.GameObjects.TileSprite
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

    const shipData = playerStore.ship

    this.ship = new Ship({
      name: "smallShip",
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      scene: this,
      shipData,
    })

    this.cameras.main.startFollow(this.ship.sprite)

    this.cursors = this.input.keyboard!.createCursorKeys()
    const button = this.add.reactDom(Score, {
      onClick: () => {
        playerStore.updateShip({ size: "large" })
        console.log("Click")
      },
    })
  }

  update(time: number, delta: number) {
    this.ship.update(this.cursors)
    autorun(() => {
      this.ship.updateShip(playerStore.ship)
    })

    // Move the background opposite to player's movement
    this.bg.tilePositionX += this.ship.deltaPosition.x
    this.bg.tilePositionY += this.ship.deltaPosition.y
  }
}

export default MainScene
