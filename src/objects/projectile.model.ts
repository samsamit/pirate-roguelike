import {
  ENEMY_COLLISION_CATEGORY,
  PROJECTILE_COLLISION_CATEGORY,
  SHIP_COLLISION_CATEGORY,
} from "../constants"
import { GlobalAnimations } from "../util/animations"

class Projectile extends Phaser.Physics.Matter.Sprite {
  declare body: MatterJS.BodyType
  private lifespan: number = 0
  private isDestoying = false
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    angle: number,
    speed: number,
    lifespan: number
  ) {
    super(scene.matter.world, x, y, "projectile")
    this.setFrictionAir(0)
    this.setFixedRotation()
    this.setVelocityX(speed * Math.cos(angle))
    this.setVelocityY(speed * Math.sin(angle))

    this.scene.add.existing(this)
    this.lifespan = lifespan

    this.setCollisionCategory(PROJECTILE_COLLISION_CATEGORY)
    this.setCollidesWith([SHIP_COLLISION_CATEGORY, ENEMY_COLLISION_CATEGORY])
    this.setOnCollide(() => {
      this.play(GlobalAnimations.explosion).once("animationcomplete", () => {
        this.setActive(false)
        this.setVisible(false)
        this.destroy()
      })
    })
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    this.lifespan -= delta

    if (!this.isDestoying && this.lifespan <= 0) {
      this.isDestoying = true
      this.play(GlobalAnimations.emptyExplosion).once(
        "animationcomplete",
        () => {
          this.setActive(false)
          this.setVisible(false)
          this.destroy()
        }
      )
    }
  }
}

export default Projectile
