import {
  largeShip,
  mast,
  mediumShip,
  sails,
  smallShip,
} from "../../util/parseShipSprites"
import { ShipSize, ShipColor, MastColor, SailColor } from "../../types"

interface ShipConstructor {
  name: string
  x: number
  y: number
  scene: Phaser.Scene
  size: ShipSize
  color: keyof typeof ShipColor
  mastColor: keyof typeof MastColor
  sailColor: keyof typeof SailColor
}

export class Ship {
  public sprite: Phaser.Physics.Matter.Sprite
  private speed = 0.003
  private maxSpeed = 1
  private turnSpeed = 0.01
  private previousPosition = { x: 0, y: 0 }
  public deltaPosition = { x: 0, y: 0 }

  constructor(private props: ShipConstructor) {
    const { scene, x, y, name } = props
    this.updateSprite()
    this.sprite = scene.matter.add.sprite(x, y, name, undefined, {
      friction: 0.1,
      frictionAir: 0.001,
      frictionStatic: 0,
      mass: 100,
    })
    this.sprite.setScale(0.5)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Calculate the current speed of the ship
    const body = this.sprite.body as MatterJS.BodyType
    const speed = body.speed

    if (cursors.up.isDown) {
      this.sprite.thrust(this.speed)
    }
    if (cursors.down.isDown && speed > 0.2) {
      this.sprite.thrustBack(this.speed)
    }

    // Apply a constant force in the direction the ship is facing
    this.sprite.setVelocityX(
      speed * Math.cos((this.sprite.angle * Math.PI) / 180)
    )
    this.sprite.setVelocityY(
      speed * Math.sin((this.sprite.angle * Math.PI) / 180)
    )

    // Limit the speed if it exceeds the maximum speed
    if (speed > this.maxSpeed) {
      const angle = Math.atan2(body.velocity.y, body.velocity.x)
      this.sprite.setVelocityX(this.maxSpeed * Math.cos(angle))
      this.sprite.setVelocityY(this.maxSpeed * Math.sin(angle))
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
  updateSprite() {
    const { scene, name, size, color, mastColor, sailColor } = this.props
    const { frameHeight, frameWidth, key } = getShipInfo(size)
    const ship = scene.textures.addDynamicTexture(name, frameWidth, frameHeight)
    if (!ship) throw Error("Failed adding dynamic texture")
    ship.setIsSpriteTexture(true)
    ship.camera.setPosition(frameWidth / 2, frameHeight / 2)
    ship.stamp(key, ShipColor[color])
    ship.stamp(mast.key, MastColor[mastColor])
    ship.stamp(sails.key, SailColor[sailColor], 4, 0)
  }
}

function getShipInfo(size: ShipSize) {
  switch (size) {
    case "small": {
      const { key, frameConfig } = smallShip
      const { frameHeight, frameWidth } = frameConfig
      return { key, frameHeight, frameWidth }
    }
    case "medium": {
      const { key, frameConfig } = mediumShip
      const { frameHeight, frameWidth } = frameConfig
      return { key, frameHeight, frameWidth }
    }
    case "large": {
      const { key, frameConfig } = largeShip
      const { frameHeight, frameWidth } = frameConfig
      return { key, frameHeight, frameWidth }
    }
  }
}
