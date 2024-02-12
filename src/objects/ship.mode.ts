import { Physics } from "phaser"

export class Ship extends Physics.Arcade.Sprite {
  declare body: Physics.Arcade.Body
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor(scene: Phaser.Scene, x: number, y: number, imageKey: string) {
    super(scene, x, y, imageKey)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)

    this.setAngle(90)
    this.setScale(0.2)
    this.setDamping(true)
    this.setDrag(0.5)
    this.setMaxVelocity(50)

    this.cursors = scene.input.keyboard!.createCursorKeys()
  }

  update() {
    if (this.cursors.up.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation,
        200,
        this.body!.acceleration!
      )
    } else {
      this.setAcceleration(0)
    }

    if (this.cursors.left.isDown) {
      this.setAngularVelocity(-50)
    } else if (this.cursors.right.isDown) {
      this.setAngularVelocity(50)
    } else {
      this.setAngularVelocity(0)
    }

    this.scene.physics.world.wrap(this, 32)
  }
}
