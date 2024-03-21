import { ShipData } from "../store/player.store"
import { Position, PositionWithAngle, Side, Size } from "../types"
import { GlobalAnimations } from "../util/animations"
import { getShipData } from "../util/shipData.functions"
import Cannon from "./cannon.model"
import CannonContainer from "./cannonContainer.model"
import ShipPhysics, { ShipControl } from "./ship.physics"
import ShipTexture from "./ship.texture"
import Wreck from "./wreck.model"

class Ship {
  private texture: ShipTexture
  public physics: ShipPhysics
  private maxHealth: number
  public health: number
  private healthBar: Phaser.GameObjects.Graphics
  private isDestroyed = false
  private cannons: Cannon[] = []
  private cannonContainer: CannonContainer
  private shipData: ShipData | null = null

  //   private shipData: ShipData

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    shipName: string,
    maxHealth: number,
    isPlayer: boolean
  ) {
    this.maxHealth = maxHealth
    this.health = maxHealth
    this.texture = new ShipTexture(scene, shipName)
    this.physics = new ShipPhysics(
      scene,
      x,
      y,
      isPlayer,
      shipName,
      this.handleCollision.bind(this)
    )
    this.healthBar = scene.add.graphics()
    this.cannonContainer = new CannonContainer(scene, this.position.position)
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
    this.healthBar.destroy()
    this.cannonContainer.destroy()
    this.physics.setCollisionCategory(0)
    this.physics.setCollidesWith(0)
    this.createWrek()
    this.physics
      .play(GlobalAnimations.explosion)
      .once("animationcomplete", () => {
        this.physics.destroy()
        this.isDestroyed = true
      })
  }

  handleCollision() {
    if (!this.shipData) return
    const prevHealthPercent = this.health / this.maxHealth
    const newHealth = this.health - 10
    const newHealthPercent = newHealth / this.maxHealth
    if (newHealthPercent <= 0.7 && prevHealthPercent > 0.7) {
      this.updateShip(this.shipData, 1)
    }
    this.health = newHealth
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

  updateShip(shipData: ShipData, damage: 0 | 1 | 2 = 0) {
    this.shipData = shipData
    const { baseTextureKey, physicsData } = getShipData(shipData)
    this.texture.build(shipData, physicsData.size, baseTextureKey, damage)
    this.physics.updateBody(physicsData)
    const newCannons = Array.from(
      { length: shipData.cannonCount / 2 },
      (_, i) => i + 1
    ).flatMap((_) => [
      new Cannon(this.scene, "left"),
      new Cannon(this.scene, "right"),
    ])
    this.cannons = newCannons
    this.cannonContainer.updateCannons(
      newCannons,
      physicsData.size,
      physicsData.centerOffset
    )
  }

  createWrek() {
    if (!this.shipData) return
    new Wreck(this.scene, this.position, this.shipData, 100)
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
}

export default Ship
