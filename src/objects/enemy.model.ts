import { PositionWithAngle } from "../types"
import Ship from "./ship.model"

class Enemy {
  private ship: Ship
  private attackRange: number
  private hostileRange: number
  private circleDistance: number // Set distance for circling
  private maxDistanceFromPlayer = 5000
  public isDestroyed: boolean = false

  constructor(
    ship: Ship,
    attackRange: number,
    hostileRange: number,
    circleDistance: number
  ) {
    this.ship = ship
    this.attackRange = attackRange
    this.hostileRange = hostileRange
    this.circleDistance = circleDistance
  }

  update(playerPosition: PositionWithAngle) {
    if (this.ship.health < 0) {
      this.ship.destroy()
      this.isDestroyed = true
      return
    }

    const { position, angle } = this.ship.position
    // Calculate the distance between the enemy and the player's ship
    const distance = Phaser.Math.Distance.Between(
      position.x,
      position.y,
      playerPosition.position.x,
      playerPosition.position.y
    )
    const angleToPlayer = Phaser.Math.Angle.Between(
      position.x,
      position.y,
      playerPosition.position.x,
      playerPosition.position.y
    )
    if (distance >= this.maxDistanceFromPlayer) {
      this.ship.destroy()
      this.isDestroyed = true
      return
    }
    if (distance <= this.attackRange) {
      // Calculate the angle for circling
      const circleAngle = angleToPlayer + Math.PI / 2

      // Calculate the position of the point on the circle
      const circlePointX =
        playerPosition.position.x + this.circleDistance * Math.cos(circleAngle)
      const circlePointY =
        playerPosition.position.y + this.circleDistance * Math.sin(circleAngle)

      // Calculate the angle towards the circle point
      const angleToCircle = Phaser.Math.Angle.Between(
        position.x,
        position.y,
        circlePointX,
        circlePointY
      )

      this.ship.update({
        targetAngleDeg: Phaser.Math.RadToDeg(angleToCircle), // Convert angle to degrees
        targetSpeed: 1,
      })
      return
    }

    // If the distance is within the attack range, move towards the player's ship
    if (distance <= this.hostileRange) {
      this.ship.update({
        targetAngleDeg: Phaser.Math.RadToDeg(angleToPlayer),
        targetSpeed: 0.2,
      })
      return
    }

    this.ship.update({
      targetAngleDeg: angle,
      targetSpeed: 0,
    })
  }
}

export default Enemy
