import { Scene } from "phaser"
import { Ship } from "../objects/ship.mode"

class MainScene extends Scene {
  private ship!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  preload() {
    this.load.image("ship", "assets/ship.png")
    this.load.image("sea", "assets/seafloor.png")
  }

  create() {
    {
      const bg = this.add.image(0, 0, "sea")
      bg.setOrigin(0, 0)
      bg.displayHeight = this.sys.canvas.height
      bg.displayWidth = this.sys.canvas.width

      this.ship = new Ship(this, 100, 100, "ship")
    }
  }

  update() {
    this.ship.update()
  }
}

export default MainScene
