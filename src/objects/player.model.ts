import { autorun } from "mobx"
import { playerStore } from "../store/player.store"
import Ship from "./ship.model"
import { ShipControl } from "./ship.physics"
import { WasdKeys } from "../scenes/main.scene"

class Player {
  private ship: Ship
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.ship = new Ship(
      scene,
      scene.sys.canvas.width / 2,
      scene.sys.canvas.height / 2,
      "player"
    )

    // Initialize scene
    scene.cameras.main.startFollow(this.ship.physics)
    scene.input.on("pointerdown", this.handleMouseClick.bind(this), scene)

    autorun(() => {
      this.ship.updateShip(playerStore.ship)
    })
  }

  handleMouseClick(pointer: Phaser.Input.Pointer) {
    this.ship.shoot()
  }

  update(background: Phaser.GameObjects.TileSprite, controls: WasdKeys) {
    this.ship.update(this.getShipControl(controls))

    // Move the background opposite to player's movement
    background.tilePositionX += this.ship.deltaPosition.x
    background.tilePositionY += this.ship.deltaPosition.y
  }

  get position() {
    return this.ship.position
  }

  getShipControl(controls: WasdKeys): ShipControl {
    const shipControl: ShipControl = {
      targetAngleDeg: 0,
      targetSpeed: 0,
    }

    // Get the current angle of the boat in degrees
    const currentAngleDeg = Phaser.Math.RadToDeg(this.ship.physics.body.angle)

    // Calculate target angle based on keyboard input, relative to the current angle
    if (controls.A.isDown) {
      shipControl.targetAngleDeg = currentAngleDeg - 90 // Turn left
    } else if (controls.D.isDown) {
      shipControl.targetAngleDeg = currentAngleDeg + 90 // Turn right
    } else {
      shipControl.targetAngleDeg = currentAngleDeg // Maintain current angle
    }

    // Calculate target speed based on keyboard input
    if (controls.W.isDown) {
      shipControl.targetSpeed = 1 // Move forward
    } else if (controls.S.isDown) {
      shipControl.targetSpeed = 0 // Stop
    } else {
      shipControl.targetSpeed = this.ship.physics.body.speed // Maintain current speed
    }

    return shipControl
  }
}

export default Player
