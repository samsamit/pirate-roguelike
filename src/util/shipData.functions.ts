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
