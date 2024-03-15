import { Position, PositionWithAngle, Side } from "../types"
import { GlobalAnimations } from "../util/animations"
import { smallCannon } from "../util/parseShipSprites"
import Projectile from "./projectile.model"

class Cannon extends Phaser.GameObjects.Sprite {
  public side: Side = "left"
  private cooldown = 1000
  private lastShot = 0
  constructor(scene: Phaser.Scene, { x, y }: Position, side: Side) {
    super(scene, x, y, smallCannon.key, 0)
    this.side = side

    scene.add.existing(this)
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
  }

  get onCooldown() {
    return this.scene.time.now - this.lastShot < this.cooldown
  }

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene)
  }

  shoot(shipPositionWithAngle: PositionWithAngle) {
    if (this.scene.time.now - this.lastShot < this.cooldown) return
    this.lastShot = this.scene.time.now
    const offset = this.side === "left" ? -1 : 1
    const adjustedAngle = Phaser.Math.DegToRad(shipPositionWithAngle.angle)

    const x = this.x
    const y = this.y + 2 * offset

    // Calculate the raw position of the cannon
    const rotatedOffsetX =
      x * Math.cos(adjustedAngle) - y * Math.sin(adjustedAngle)
    const rotatedOffsetY =
      x * Math.sin(adjustedAngle) + y * Math.cos(adjustedAngle)

    // Rotate the raw positions with the ship's angle
    const rotatedRawPosX = shipPositionWithAngle.position.x + rotatedOffsetX
    const rotatedRawPosY = shipPositionWithAngle.position.y + rotatedOffsetY

    // Calculate the angle of the cannon
    const cannonAngle = shipPositionWithAngle.angle + 90 * offset

    // Create and launch the projectile
    new Projectile(
      this.scene,
      rotatedRawPosX,
      rotatedRawPosY,
      Phaser.Math.DegToRad(cannonAngle),
      1,
      5000
    )

    // Trigger animation
    this.play(GlobalAnimations.smallCannon)
  }
}

export default Cannon
