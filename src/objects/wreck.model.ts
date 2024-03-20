import { SHIP_COLLISION_CATEGORY, WRECK_COLLISION_CATEGORY } from "../constants"
import { ShipData, playerStore } from "../store/player.store"
import { PositionWithAngle, ShipColor } from "../types"
import { getShipData } from "../util/shipData.functions"

class Wreck extends Phaser.Physics.Matter.Sprite {
  constructor(
    scene: Phaser.Scene,
    { position: { x, y }, angle }: PositionWithAngle,
    shipData: ShipData,
    experience: number
  ) {
    const { baseTextureKey, physicsData } = getShipData(shipData)
    super(
      scene.matter.world,
      x,
      y,
      baseTextureKey,
      ShipColor[shipData.color] + 2
    )
    this.setData({ isWreck: true })

    this.setCollisionCategory(WRECK_COLLISION_CATEGORY)
    this.setCollidesWith([SHIP_COLLISION_CATEGORY])

    this.setOnCollide(() => {
      this.setCollidesWith([])
      playerStore.addExperience(experience)
      scene.tweens.add({
        targets: this,
        duration: 250, // Duration of the tween in milliseconds
        scaleX: 0, // Shrink to 0 in the X direction
        scaleY: 0, // Shrink to 0 in the Y direction
        alpha: 0, // Fade out the sprite
        onComplete: () => {
          // Callback function when the tween is complete
          this.destroy()
        },
      })
    })

    const { size } = physicsData
    this.setAngle(angle)
    this.setDisplaySize(size.width, size.height)
    this.scene.add.existing(this)
  }
}

export default Wreck
