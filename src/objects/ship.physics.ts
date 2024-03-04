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
    private shipName: string,
    private collisionCallback: () => void
  ) {
    super(scene.matter.world, x, y, shipName, undefined, {
      friction: 0.1,
      frictionAir: 0.001,
      frictionStatic: 0,
      mass: 100,
    })
    scene.add.existing(this)
  }

  updateBody({ size, acceleration, mass, turnSpeed }: ShipPhysicsData) {
    // Store the current position
    const currentX = this.x
    const currentY = this.y
    const currentAngle = this.angle
    const currentVelocity = this.getAngularVelocity()

    //Update physics
    this.setBody({
      width: size.width,
      height: size.height,
      x: currentX,
      y: currentY,
    })
    this.setTexture(this.shipName)

    this.acceleration = acceleration
    this.turnSpeed = turnSpeed
    this.setMass(mass)

    // Update the position of the sprite
    this.setAngle(currentAngle)
    this.setAngularVelocity(currentVelocity)

    this.setOnCollide(this.collisionCallback)
  }

  update({ targetAngleDeg, targetSpeed }: ShipControl) {
    // Calculate acceleration based on the difference between target speed and current speed
    const speedDifference = targetSpeed - this.body.speed
    const acceleration = Phaser.Math.Clamp(
      speedDifference,
      0,
      this.acceleration
    )

    // Apply thrust based on acceleration
    this.thrust(acceleration)

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
