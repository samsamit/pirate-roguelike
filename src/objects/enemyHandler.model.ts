import { Position, PositionWithAngle } from "../types"
import Enemy from "./enemy.model"
import Ship from "./ship.model"

class EnemyHandler {
  private scene: Phaser.Scene
  private enemies: Enemy[]
  private enemyCounter = 0
  private spawnRadius = 1200

  private minSpawnInterval = 1000
  private maxSpawnInterval = 6000
  private lastSpawnTime = 0
  private nextSpawnTime = 0
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.enemies = []
    this.nextSpawnTime = this.getRandomSpawnInterval()
  }

  update(time: number, playerPosition: PositionWithAngle) {
    if (this.lastSpawnTime === 0) this.lastSpawnTime = time
    if (
      time - this.lastSpawnTime > this.nextSpawnTime &&
      this.enemies.length < 1
    ) {
      this.enemies.push(this.getEnemy(playerPosition.position))
      this.lastSpawnTime = time
      this.nextSpawnTime = this.getRandomSpawnInterval()
    }

    this.enemies.forEach((e) => {
      e.update(playerPosition)
    })
    this.enemies = this.enemies.filter((e) => !e.isDestroyed)
  }

  getEnemy(playerPosition: Position) {
    const { x, y } = this.getEnemyPosition(playerPosition)
    const ship = new Ship(
      this.scene,
      x,
      y,
      this.enemyCounter + "enemy",
      100,
      false
    )
    this.enemyCounter = this.enemyCounter + 1
    ship.updateShip({
      color: "grey",
      mastColor: "gray",
      sailColor: "grey",
      size: "medium",
    })
    return new Enemy(this.scene, ship, 800, 500, 300)
  }

  getRandomSpawnInterval(): number {
    // Generate a random spawn interval between min and max interval values
    return (
      Math.random() * (this.maxSpawnInterval - this.minSpawnInterval) +
      this.minSpawnInterval
    )
  }

  getEnemyPosition(playerPosition: Position): Position {
    const { x, y } = playerPosition
    // Generate a random angle in radians
    const angle = Math.random() * 2 * Math.PI

    // Generate a random distance within the radius
    const randomDistance = Math.random() * this.spawnRadius

    // Calculate the new point's coordinates
    const newX = x + randomDistance * Math.cos(angle)
    const newY = y + randomDistance * Math.sin(angle)

    return { x: newX, y: newY }
  }
}

export default EnemyHandler
