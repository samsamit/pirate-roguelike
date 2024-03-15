import { Position, PositionWithAngle, Side } from "../types"
import Ship from "./ship.model"

class Enemy {
  private ship: Ship
  private attackRange: number
  private hostileRange: number
  private circleDistance: number // Set distance for circling
  private maxDistanceFromPlayer = 5000
  public isDestroyed: boolean = false
  private marker: Phaser.GameObjects.Graphics

  constructor(
    private scene: Phaser.Scene,
    ship: Ship,
    attackRange: number,
    hostileRange: number,
    circleDistance: number
  ) {
    this.ship = ship
    this.attackRange = attackRange
    this.hostileRange = hostileRange
    this.circleDistance = circleDistance
    this.marker = scene.add.graphics()
  }

  update(playerPosition: PositionWithAngle) {
    if (this.ship.health < 0) {
      this.ship.destroy()
      this.marker.destroy()
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

    this.drawMarker(playerPosition.position)

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
        targetSpeed: 0.5,
      })
      const shootSide = this.sootOnSide(distance, playerPosition)
      if (!shootSide) return
      this.ship.shoot(shootSide)
      return
    }

    // If the distance is within the attack range, move towards the player's ship
    if (distance <= this.hostileRange) {
      this.ship.update({
        targetAngleDeg: Phaser.Math.RadToDeg(angleToPlayer),
        targetSpeed: 0.2,
      })
    }

    this.ship.update({
      targetAngleDeg: angle,
      targetSpeed: 0,
    })
  }

  sootOnSide(
    distanceToPlayer: number,
    { position }: PositionWithAngle
  ): Side | null {
    const distanceToShoot = 400
    const angleTreshold = 25
    // Check if player is within shooting range
    if (distanceToPlayer > distanceToShoot) {
      return null
    }
    // Calculate angle between player and enemy
    const angleBetweenShips =
      Math.atan2(
        position.y - this.ship.position.position.y,
        position.x - this.ship.position.position.x
      ) *
      (180 / Math.PI)

    // Calculate relative angle of player ship to enemy ship
    const relativeAngle = normalizeAngle(
      this.ship.position.angle - angleBetweenShips
    )

    if (relativeAngle < -90 + angleTreshold && relativeAngle > -90) {
      return "right"
    }

    if (relativeAngle > 90 - angleTreshold && relativeAngle < 90) {
      return "left"
    }

    // Player is within both shooting range and angle
    return null
  }

  drawMarker(playerPosition: Position) {
    // Clear previous marker
    this.marker.clear()

    // Set line style
    this.marker.fillStyle(0xff0000)

    const canvasWidth = this.scene.sys.canvas.width
    const canvasHeight = this.scene.sys.canvas.height
    const leftX = this.scene.cameras.main.scrollX
    const topY = this.scene.cameras.main.scrollY
    const rightX = this.scene.cameras.main.scrollX + canvasWidth
    const bottomY = this.scene.cameras.main.scrollY + canvasHeight

    const {
      position: { x: thisX, y: thisY },
    } = this.ship.position

    const line = new Phaser.Geom.Line(
      thisX,
      thisY,
      playerPosition.x,
      playerPosition.y
    )

    const top = new Phaser.Geom.Line(leftX, topY, rightX, topY)
    const right = new Phaser.Geom.Line(rightX, topY, rightX, bottomY)
    const bottom = new Phaser.Geom.Line(leftX, bottomY, rightX, bottomY)
    const left = new Phaser.Geom.Line(leftX, topY, leftX, bottomY)

    const intersect = new Phaser.Math.Vector3()
    if (
      !Phaser.Geom.Intersects.LineToLine(line, top, intersect) &&
      !Phaser.Geom.Intersects.LineToLine(line, right, intersect) &&
      !Phaser.Geom.Intersects.LineToLine(line, bottom, intersect) &&
      !Phaser.Geom.Intersects.LineToLine(line, left, intersect)
    )
      return
    const { x, y } = intersect

    // Draw circle at the calculated position
    this.marker.fillCircle(x, y, 10) // Adjust the radius as needed
  }
}

function normalizeAngle(angle: number): number {
  if (angle <= -180) {
    angle += 360
  }
  if (angle > 180) {
    angle -= 360
  }
  return angle
}

export default Enemy
