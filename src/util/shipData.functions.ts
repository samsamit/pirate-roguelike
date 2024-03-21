import { ShipData } from "../store/player.store"
import { ShipPhysicsData } from "../types"
import { smallShip, mediumShip, largeShip } from "./parseShipSprites"

export const getShipData = (
  shipData: ShipData
): {
  physicsData: ShipPhysicsData
  baseTextureKey: string
} => {
  switch (shipData.size) {
    case "small":
      return {
        physicsData: {
          acceleration: shipData.acceleration,
          mass: 100,
          turnSpeed: 0.008 + shipData.turnSpeedBoost,
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
          acceleration: shipData.acceleration,
          mass: 150,
          turnSpeed: 0.005 + shipData.turnSpeedBoost,
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
          acceleration: shipData.acceleration,
          mass: 200,
          turnSpeed: 0.003 + shipData.turnSpeedBoost,
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
