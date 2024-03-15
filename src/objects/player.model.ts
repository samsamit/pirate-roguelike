import { autorun } from "mobx"
import { playerStore } from "../store/player.store"
import Ship from "./ship.model"
import { ShipControl } from "./ship.physics"
import { WasdKeys } from "../scenes/main.scene"

class Player {
  private ship: Ship
  private scene: Phaser.Scene

  lastShot = 0

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
    // Get the ship's position
    const shipPosition = new Phaser.Math.Vector2(
      this.ship.position.position.x,
      this.ship.position.position.y
    )
    const shipAngleInRad = Phaser.Math.DegToRad(this.ship.position.angle + 90)

    // Get the cursor position
    const cursorPosition = new Phaser.Math.Vector2(
      pointer.worldX,
      pointer.worldY
    )

    // Get the direction vector from the ship to the cursor
    const directionVector = cursorPosition.subtract(shipPosition).normalize()

    // Get the ship's forward vector based on its rotation
    const shipForwardVector = new Phaser.Math.Vector2(
      Math.cos(shipAngleInRad),
      Math.sin(shipAngleInRad)
    )

    // Calculate the dot product of the ship's forward vector and the direction vector to determine the side
    const dotProduct = shipForwardVector.dot(directionVector)

    // Determine if the click is on the left or right side based on the dot product
    if (dotProduct >= 0) {
      this.ship.shoot("right")
    } else {
      this.ship.shoot("left")
    }
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
