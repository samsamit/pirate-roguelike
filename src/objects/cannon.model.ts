import { Position, Side } from "../types"
import { smallCannon } from "../util/parseShipSprites"

class Cannon extends Phaser.GameObjects.Sprite {
  private animKey: string
  public side: Side = "left"
  constructor(
    scene: Phaser.Scene,
    { x, y }: Position,
    shipName: string,
    side: Side
  ) {
    super(scene, x, y, smallCannon.key, 0)
    this.animKey = shipName + "_cannon_anim"
    this.side = side
    scene.anims.create({
      key: this.animKey,
      frames: scene.anims.generateFrameNames(smallCannon.key, {
        frames: [0, 1, 2, 0],
      }),
      frameRate: 10,
      repeat: 0,
    })

    scene.add.existing(this)
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
  }

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene)
  }

  shoot() {
    console.log("anim")
    this.play(this.animKey)
  }
}

export default Cannon
