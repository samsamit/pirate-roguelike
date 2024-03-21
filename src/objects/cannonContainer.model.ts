import { Position, PositionWithAngle, Side, Size } from "../types"
import Cannon from "./cannon.model"

class CannonContainer extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, { x, y }: Position) {
    super(scene, x, y)
    this.setDepth(1000)
    scene.add.existing(this)
  }

  update(shipPosition: PositionWithAngle) {
    this.setPosition(shipPosition.position.x, shipPosition.position.y)
    this.setAngle(shipPosition.angle)
  }

  updateCannons(cannons: Cannon[], shipSize: Size, centerOffset: number) {
    this.removeAll()
    const leftSideCannons = cannons.filter((c) => c.side === "left")
    const rightSideCannons = cannons.filter((c) => c.side === "right")

    const setupCannons = (side: Side, cannons: Cannon[]) => {
      const sideMultipler = side === "left" ? -1 : 1
      cannons.forEach((cannon, i) => {
        this.add(cannon)
        const cannonOffset = shipSize.height / 2 + cannon.width / 2 - 2
        const cannonY = cannonOffset * sideMultipler
        const cannonXOffset = i * cannon.width

        const cannonX =
          cannonXOffset - ((cannons.length - 1) * cannon.width) / 2
        cannon.setAngle(-90 * sideMultipler)
        cannon.setPosition(cannonX - centerOffset, cannonY)
      })
    }

    setupCannons("left", leftSideCannons)
    setupCannons("right", rightSideCannons)
  }
}

export default CannonContainer
