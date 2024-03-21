import {
  ENEMY_COLLISION_CATEGORY,
  PROJECTILE_COLLISION_CATEGORY,
  SHIP_COLLISION_CATEGORY,
  WRECK_COLLISION_CATEGORY,
} from "../constants"
import { ShipPhysicsData, Size } from "../types"

export interface ShipControl {
  targetAngleDeg: number
  targetSpeed: number
}

class ShipPhysics extends Phaser.Physics.Matter.Sprite {
  declare body: MatterJS.BodyType
  private acceleration = 0.003
  private turnSpeed = 0.01

  private previousPosition = { x: 0, y: 0 }
  public deltaPosition = { x: 0, y: 0 }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private isPlayer: boolean,
    private shipName: string,
    private collisionCallback: () => void
  ) {
    super(scene.matter.world, x, y, shipName, undefined)

    scene.add.existing(this)
  }

  get size(): Size {
    return {
      height: this.height,
      width: this.width,
    }
  }

  updateBody({ size, acceleration, mass, turnSpeed }: ShipPhysicsData) {
    // Store the current position
    const currentX = this.x
    const currentY = this.y
    const currentAngle = this.angle
    const currentAngularVelocity = this.getAngularVelocity()
    const currentVelocity = this.getVelocity()

    //Update physics
    this.setBody({
      width: size.width,
      height: size.height,
      x: currentX,
      y: currentY,
    })
    this.setTexture(this.shipName)

    this.setFriction(1, 0.008)
    console.log(acceleration)
    this.acceleration = acceleration
    this.turnSpeed = turnSpeed
    this.setMass(mass)

    // Update the position of the sprite
    this.setAngle(currentAngle)
    this.setAngularVelocity(currentAngularVelocity)
    this.setVelocity(currentVelocity.x ?? 0, currentVelocity.y)

    // COLLISION
    this.setCollisionCategory(
      this.isPlayer ? SHIP_COLLISION_CATEGORY : ENEMY_COLLISION_CATEGORY
    )
    this.setCollidesWith([
      ENEMY_COLLISION_CATEGORY,
      SHIP_COLLISION_CATEGORY,
      PROJECTILE_COLLISION_CATEGORY,
      ...(this.isPlayer ? [WRECK_COLLISION_CATEGORY] : []),
    ])
    this.setOnCollide(
      (event: Phaser.Types.Physics.Matter.MatterCollisionData) => {
        const isWreck = event.bodyB.gameObject?.getData("isWreck")
        if (isWreck) return
        this.collisionCallback()
      }
    )
  }

  update({ targetAngleDeg, targetSpeed }: ShipControl) {
    // Calculate acceleration based on the difference between target speed and current speed
    if (this.shipName === "player") console.log(this.body.speed)

    // Apply thrust based on acceleration
    this.thrust(targetSpeed === 0 ? 0 : this.acceleration)

    // Calculate normalized angular velocity based on angle difference
    const currentAngleDec = Phaser.Math.RadToDeg(this.body.angle)
    const angleBetween = Phaser.Math.Angle.ShortestBetween(
      currentAngleDec,
      targetAngleDeg
    )

    const angularVelocity = Phaser.Math.Clamp(
      angleBetween * this.turnSpeed,
      -this.turnSpeed,
      this.turnSpeed
    )
    // Apply angular velocity
    this.setAngularVelocity(angularVelocity)

    // Update the previous position of the ship
    this.deltaPosition.x = this.x - this.previousPosition.x
    this.deltaPosition.y = this.y - this.previousPosition.y
    this.previousPosition.x = this.x
    this.previousPosition.y = this.y
  }
}

export default ShipPhysics
