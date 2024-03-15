class Projectile extends Phaser.Physics.Matter.Sprite {
  declare body: MatterJS.BodyType
  private lifespan: number = 0

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

    // this.setCollisionCategory(2)
    // this.setCollidesWith([1])
    // this.setOnCollide(() => {
    //   this.setActive(false)
    //   this.setVisible(false)
    //   this.world.remove(this.body, true)
    // })
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    this.lifespan -= delta

    if (this.lifespan <= 0) {
      this.setActive(false)
      this.setVisible(false)
      this.world.remove(this.body, true)
    }
  }
}

export default Projectile
