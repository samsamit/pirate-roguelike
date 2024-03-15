import { ShipData } from "../store/player.store"
import {
  Position,
  PositionWithAngle,
  ShipPhysicsData,
  Side,
  Size,
} from "../types"
import { largeShip, mediumShip, smallShip } from "../util/parseShipSprites"
import Cannon from "./cannon.model"
import CannonContainer from "./cannonContainer.model"
import ShipPhysics, { ShipControl } from "./ship.physics"
import ShipTexture from "./ship.texture"

class Ship {
  private texture: ShipTexture
  public physics: ShipPhysics
  public health: number = 100
  private healthBar: Phaser.GameObjects.Graphics
  private isDestroyed = false
  private cannons: Cannon[] = []
  private cannonContainer: CannonContainer

  //   private shipData: ShipData

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    shipName: string // shipData: ShipData
  ) {
    this.cannons.push(
      ...[
        new Cannon(scene, { x: 0, y: 0 }, "left"),
        new Cannon(scene, { x: 0, y: 0 }, "left"),
        new Cannon(scene, { x: 0, y: 0 }, "left"),
        new Cannon(scene, { x: 0, y: 0 }, "left"),
        new Cannon(scene, { x: 0, y: 0 }, "left"),
        new Cannon(scene, { x: 0, y: 0 }, "right"),
        new Cannon(scene, { x: 0, y: 0 }, "right"),
        new Cannon(scene, { x: 0, y: 0 }, "right"),
        new Cannon(scene, { x: 0, y: 0 }, "right"),
        new Cannon(scene, { x: 0, y: 0 }, "right"),
      ]
    )
    this.texture = new ShipTexture(scene, shipName)
    this.physics = new ShipPhysics(
      scene,
      x,
      y,
      shipName,
      this.handleCollision.bind(this)
    )
    this.healthBar = scene.add.graphics()
    this.cannonContainer = new CannonContainer(
      scene,
      this.position.position,
      this.cannons
    )
  }

  shoot(side: Side) {
    const cannonsToShoot = this.cannons.filter(
      (c) => c.side === side && !c.onCooldown
    )
    if (cannonsToShoot.length === 0) return
    const randomCannonIndex = Math.floor(Math.random() * cannonsToShoot.length)
    const randomCannon = cannonsToShoot[randomCannonIndex]
    randomCannon.shoot(this.position)
  }

  destroy() {
    this.texture.texture.destroy()
    this.physics.destroy()
    this.healthBar.destroy()
    this.cannonContainer.destroy()
    this.isDestroyed = true
  }

  handleCollision() {
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
    if (this.isDestroyed) return
    this.physics.update(shipControl)
    this.updateHealthBar() // Assuming initial health is 100%
    this.cannonContainer.update(this.position)
  }

  updateShip(shipData: ShipData) {
    const { baseTextureKey, physicsData } = this.getShipData(shipData)
    this.texture.build(shipData, physicsData.size, baseTextureKey)
    this.physics.updateBody(physicsData)
    this.cannonContainer.updateCannons(
      physicsData.size,
      physicsData.centerOffset
    )
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
            centerOffset: 5,
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
            centerOffset: 5,
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
            centerOffset: 15,
          },
          baseTextureKey: largeShip.key,
        }
    }
  }
}

export default Ship
