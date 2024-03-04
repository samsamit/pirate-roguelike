import { PositionWithAngle } from "../types"
import Enemy from "./enemy.model"
import Ship from "./ship.model"

class EnemyHandler {
  private scene: Phaser.Scene
  private enemies: Enemy[]
  private enemyCounter = 0
  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.enemies = [this.getEnemy()]
  }

  update(playerPosition: PositionWithAngle) {
    if (this.enemies.length <= 0) this.enemies.push(this.getEnemy())
    this.enemies.forEach((e) => {
      e.update(playerPosition)
    })
    this.enemies = this.enemies.filter((e) => !e.isDestroyed)
  }

  getEnemy() {
    const ship = new Ship(this.scene, 0, 0, this.enemyCounter + "ememy")
    this.enemyCounter = this.enemyCounter + 1
    ship.updateShip({
      color: "grey",
      mastColor: "gray",
      sailColor: "grey",
      size: "medium",
    })
    return new Enemy(ship, 800, 500, 300)
  }
}

export default EnemyHandler
