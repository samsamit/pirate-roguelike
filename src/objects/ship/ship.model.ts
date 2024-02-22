import Phaser from "phaser"
import { ShipData } from "../../store/player.store"
import {
  ShipColor,
  MastColor,
  SailColor,
  ShipPhysics,
  ShipSize,
} from "../../types"
import {
  largeShip,
  mast,
  mediumShip,
  sails,
  smallShip,
} from "../../util/parseShipSprites"

class Ship extends Phaser.Physics.Matter.Sprite {
  private acceleration = 0.003
  private topSpeed = 1
  private turnSpeed = 0.01

  private previousPosition = { x: 0, y: 0 }
  public deltaPosition = { x: 0, y: 0 }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private shipName: string
  ) {
    super(scene.matter.world, x, y, "shipTexture", undefined, {
      friction: 0.1,
      frictionAir: 0.001,
      frictionStatic: 0,
    })
    this.body
    // Add ship to the scene and to the physics world
    scene.add.existing(this)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const body = this.body as MatterJS.BodyType
    const speed = body.speed
    // Ship thrust
    if (cursors.up.isDown) {
      this.thrust(this.acceleration)
    }
    if (cursors.down.isDown && speed > 0.2) {
      this.thrustBack(this.acceleration)
    }

    // Apply a constant force in the direction the ship is facing
    this.setVelocityX(speed * Math.cos((this.angle * Math.PI) / 180))
    this.setVelocityY(speed * Math.sin((this.angle * Math.PI) / 180))

    // Limit the speed if it exceeds the maximum speed
    if (speed > this.topSpeed) {
      const angle = Math.atan2(body.velocity.y, body.velocity.x)
      this.setVelocityX(this.topSpeed * Math.cos(angle))
      this.setVelocityY(this.topSpeed * Math.sin(angle))
    }

    // Adjust angular velocity based on current speed
    const turnFactor = Math.min(1, Math.max(0.2, 1 - speed / 10)) // Adjust constants as needed
    if (cursors.left.isDown) {
      this.setAngularVelocity(-this.turnSpeed * turnFactor) // Adjust angular velocity as needed
    } else if (cursors.right.isDown) {
      this.setAngularVelocity(this.turnSpeed * turnFactor) // Adjust angular velocity as needed
    } else {
      this.setAngularVelocity(0)
    }

    // Update the previous position of the ship
    this.deltaPosition.x = this.x - this.previousPosition.x
    this.deltaPosition.y = this.y - this.previousPosition.y
    this.previousPosition.x = this.x
    this.previousPosition.y = this.y
  }

  updateShip(shipData: ShipData) {
    const { size, color, mastColor, sailColor } = shipData
    const {
      frameHeight,
      frameWidth,
      key,
      physics: { acceleration, mass, topSpeed, turnSpeed },
    } = getShipInfo(size)

    const angle = this.angle
    const velocity = this.getAngularVelocity()

    // Set the origin to the center of the sprite
    this.setOrigin(0.5)

    // Store the current position
    const currentX = this.x
    const currentY = this.y

    // Recreate the body with the new dimensions
    this.setBody({
      width: frameWidth,
      height: frameHeight,
    })
    this.setAngle(angle)
    this.setAngularVelocity(velocity)

    // Update the position of the sprite
    this.setPosition(currentX, currentY)

    // Create dynamic texture
    if (this.texture) this.texture.destroy()
    const texture = this.scene.textures.addDynamicTexture(
      this.shipName,
      this.width,
      this.height
    )
    if (!texture) throw Error("Failed to create ship texture")

    // Update texture
    texture.setSize(frameWidth, frameHeight)
    texture.camera.setPosition(frameWidth / 2, frameHeight / 2)
    texture.stamp(key, ShipColor[color])
    texture.stamp(mast.key, MastColor[mastColor])
    texture.stamp(sails.key, SailColor[sailColor], 4, 0)

    //Update physics
    this.acceleration = acceleration
    this.topSpeed = topSpeed
    this.turnSpeed = turnSpeed
    this.setMass(mass)

    this.setTexture(this.shipName)
  }
}

function getShipInfo(size: ShipSize): {
  key: string
  frameHeight: number
  frameWidth: number
  physics: ShipPhysics
} {
  switch (size) {
    case "small": {
      const { key, frameConfig } = smallShip
      const { frameHeight, frameWidth } = frameConfig
      const physics: ShipPhysics = {
        acceleration: 0.003,
        mass: 100,
        topSpeed: 1,
        turnSpeed: 0.01,
      }
      return { key, frameHeight, frameWidth, physics }
    }
    case "medium": {
      const { key, frameConfig } = mediumShip
      const { frameHeight, frameWidth } = frameConfig

      const physics: ShipPhysics = {
        acceleration: 0.003,
        mass: 100,
        topSpeed: 1,
        turnSpeed: 0.01,
      }
      return { key, frameHeight, frameWidth, physics }
    }
    case "large": {
      const { key, frameConfig } = largeShip
      const { frameHeight, frameWidth } = frameConfig
      const physics: ShipPhysics = {
        acceleration: 0.003,
        mass: 100,
        topSpeed: 1,
        turnSpeed: 0.01,
      }
      return { key, frameHeight, frameWidth, physics }
    }
  }
}

export default Ship
