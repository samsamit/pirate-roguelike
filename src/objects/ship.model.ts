import { ShipData } from "../store/player.store"
import { Position, PositionWithAngle, ShipPhysicsData, Size } from "../types"
import { largeShip, mediumShip, smallShip } from "../util/parseShipSprites"
import ShipPhysics, { ShipControl } from "./ship.physics"
import ShipTexture from "./ship.texture"

class Ship {
  private texture: ShipTexture
  public physics: ShipPhysics

  public health: number = 100
  private healthBar: Phaser.GameObjects.Graphics

  //   private shipData: ShipData

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    shipName: string // shipData: ShipData
  ) {
    this.texture = new ShipTexture(scene, shipName)
    this.physics = new ShipPhysics(
      scene,
      x,
      y,
      shipName,
      this.handleCollision.bind(this)
    )
    this.healthBar = scene.add.graphics()
  }

  handleCollision() {
    console.log("collision")
    this.health = this.health - 10
  }

  get size(): Size {
    return { width: this.physics.width, height: this.physics.height }
  }

  get position(): PositionWithAngle {
    return {
      position: { x: this.physics.x, y: this.physics.y },
      angle: this.physics.angle,
    }
  }

  get deltaPosition(): Position {
    return this.physics.deltaPosition
  }

  update(shipControl: ShipControl) {
    this.physics.update(shipControl)
    this.updateHealthBar() // Assuming initial health is 100%
  }

  updateShip(shipData: ShipData) {
    const { baseTextureKey, physicsData } = this.getShipData(shipData)
    this.texture.build(shipData, physicsData.size, baseTextureKey)
    this.physics.updateBody(physicsData)
  }

  updateHealthBar() {
    const healthBarWidth = 100
    const healthBarHeight = 10
    const colorGreen = 0x00ff00
    const colorRed = 0xff0000
    const colorBlack = 0x000000
    const x = this.physics.x - healthBarWidth / 2
    const y = this.physics.y + 35
    const percentage = this.health / 100

    // Clear the existing graphics (if any)
    this.healthBar.clear()

    // Draw the background of the health bar (black border)
    this.healthBar.fillStyle(colorBlack)
    this.healthBar.fillRect(
      x - 1,
      y - 1,
      healthBarWidth + 2,
      healthBarHeight + 2
    )

    // Draw the background of the health bar (red)
    this.healthBar.fillStyle(colorRed)
    this.healthBar.fillRect(x, y, healthBarWidth, healthBarHeight)

    // Draw the current health level (green)
    const width = Math.max(0, healthBarWidth * percentage)
    this.healthBar.fillStyle(colorGreen)
    this.healthBar.fillRect(x, y, width, healthBarHeight)
  }

  private getShipData(shipData: ShipData): {
    physicsData: ShipPhysicsData
    baseTextureKey: string
  } {
    switch (shipData.size) {
      case "small":
        return {
          physicsData: {
            acceleration: 0.003,
            mass: 100,
            turnSpeed: 0.01,
            size: {
              width: smallShip.frameConfig.frameWidth,
              height: smallShip.frameConfig.frameHeight,
            },
          },
          baseTextureKey: smallShip.key,
        }
      case "medium":
        return {
          physicsData: {
            acceleration: 0.003,
            mass: 100,
            turnSpeed: 0.01,
            size: {
              width: mediumShip.frameConfig.frameWidth,
              height: mediumShip.frameConfig.frameHeight,
            },
          },
          baseTextureKey: mediumShip.key,
        }
      case "large":
        return {
          physicsData: {
            acceleration: 0.003,
            mass: 100,
            turnSpeed: 0.01,
            size: {
              width: largeShip.frameConfig.frameWidth,
              height: largeShip.frameConfig.frameHeight,
            },
          },
          baseTextureKey: largeShip.key,
        }
    }
  }
}

export default Ship
