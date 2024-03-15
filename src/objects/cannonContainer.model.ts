import { Position, PositionWithAngle, Side, Size } from "../types"
import Cannon from "./cannon.model"

class CannonContainer extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    { x, y }: Position,
    private cannons: Cannon[]
  ) {
    super(scene, x, y)
    this.setDepth(1000)
    cannons.forEach((cannon) => {
      this.add(cannon)
    })
    scene.add.existing(this)
  }

  update(shipPosition: PositionWithAngle, shipSize: Size) {
    const leftSideCannons = this.cannons.filter((c) => c.side === "left")
    const rightSideCannons = this.cannons.filter((c) => c.side === "right")

    const setupCannons = (side: Side, cannons: Cannon[]) => {
      const sideMultipler = side === "left" ? -1 : 1
      cannons.forEach((cannon, i) => {
        const cannonOffset = shipSize.height / 2 + cannon.width / 2 - 2
        const cannonY = cannonOffset * sideMultipler
        const cannonXOffset = i * cannon.width

        const cannonX =
          cannonXOffset - ((cannons.length - 1) * cannon.width) / 2
        cannon.setAngle(-90 * sideMultipler)
        cannon.setPosition(cannonX, cannonY)
      })
    }

    setupCannons("left", leftSideCannons)
    setupCannons("right", rightSideCannons)
    this.setPosition(shipPosition.position.x, shipPosition.position.y)
    this.setAngle(shipPosition.angle)
  }
}

export default CannonContainer
