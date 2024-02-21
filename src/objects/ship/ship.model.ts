import {
  largeShip,
  mast,
  mediumShip,
  sails,
  smallShip,
} from "../../util/parseShipSprites"
import {
  ShipSize,
  ShipColor,
  MastColor,
  SailColor,
  ShipPhysics,
} from "../../types"
import { ShipData } from "../../store/player.store"

interface ShipConstructor {
  name: string
  x: number
  y: number
  scene: Phaser.Scene
  shipData: ShipData
}

export class Ship {
  private texture: Phaser.Textures.DynamicTexture | null = null
  public sprite: Phaser.Physics.Matter.Sprite
  private acceleration = 0.003
  private topSpeed = 1
  private turnSpeed = 0.01
  private previousPosition = { x: 0, y: 0 }
  public deltaPosition = { x: 0, y: 0 }

  constructor(private props: ShipConstructor) {
    const { scene, x, y, name, shipData } = props
    const {
      physics: { mass },
    } = getShipInfo(shipData.size)
    this.updateShip(shipData)
    this.sprite = scene.matter.add.sprite(x, y, name, undefined, {
      friction: 0.1,
      frictionAir: 0.001,
      frictionStatic: 0,
      mass,
    })
    this.sprite.setScale(0.5)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Calculate the current speed of the ship
    const body = this.sprite.body as MatterJS.BodyType
    const speed = body.speed

    if (cursors.up.isDown) {
      this.sprite.thrust(this.acceleration)
    }
    if (cursors.down.isDown && speed > 0.2) {
      this.sprite.thrustBack(this.acceleration)
    }

    // Apply a constant force in the direction the ship is facing
    this.sprite.setVelocityX(
      speed * Math.cos((this.sprite.angle * Math.PI) / 180)
    )
    this.sprite.setVelocityY(
      speed * Math.sin((this.sprite.angle * Math.PI) / 180)
    )

    // Limit the speed if it exceeds the maximum speed
    if (speed > this.topSpeed) {
      const angle = Math.atan2(body.velocity.y, body.velocity.x)
      this.sprite.setVelocityX(this.topSpeed * Math.cos(angle))
      this.sprite.setVelocityY(this.topSpeed * Math.sin(angle))
    }

    // Adjust angular velocity based on current speed
    const turnFactor = Math.min(1, Math.max(0.2, 1 - speed / 10)) // Adjust constants as needed
    if (cursors.left.isDown) {
      this.sprite.setAngularVelocity(-this.turnSpeed * turnFactor) // Adjust angular velocity as needed
    } else if (cursors.right.isDown) {
      this.sprite.setAngularVelocity(this.turnSpeed * turnFactor) // Adjust angular velocity as needed
    } else {
      this.sprite.setAngularVelocity(0)
    }

    // Update the previous position of the ship
    this.deltaPosition.x = this.sprite.x - this.previousPosition.x
    this.deltaPosition.y = this.sprite.y - this.previousPosition.y
    this.previousPosition.x = this.sprite.x
    this.previousPosition.y = this.sprite.y
  }
  updateShip(shipData: ShipData) {
    const { scene, name } = this.props
    const { size, color, mastColor, sailColor } = shipData
    const {
      frameHeight,
      frameWidth,
      key,
      physics: { acceleration, mass, topSpeed, turnSpeed },
    } = getShipInfo(size)
    if (!this.texture) {
      this.texture = scene.textures.addDynamicTexture(
        name,
        frameWidth,
        frameHeight
      )
    } else {
      this.texture.clear()
    }
    if (!this.texture) throw Error("Cant create texture")
    this.texture.setIsSpriteTexture(true)
    this.texture.camera.setPosition(frameWidth / 2, frameHeight / 2)
    this.texture.stamp(key, ShipColor[color])
    this.texture.stamp(mast.key, MastColor[mastColor])
    this.texture.stamp(sails.key, SailColor[sailColor], 4, 0)

    // Update stats
    this.acceleration = acceleration
    this.topSpeed = topSpeed
    this.turnSpeed = turnSpeed
    if (this.sprite) this.sprite.setMass(mass)
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
