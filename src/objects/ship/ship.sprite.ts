import { ShipSize, ShipColor, MastColor, SailColor } from "../../types"
import {
  smallShip,
  mediumShip,
  largeShip,
  mast,
  sails,
} from "../../util/parseShipSprites"

interface ShipSpriteProps {
  scene: Phaser.Scene
  name: string
  size: ShipSize
  color: keyof typeof ShipColor
  mastColor: keyof typeof MastColor
  sailColor: keyof typeof SailColor
}

export const updateShipSprite = ({
  scene,
  name,
  size,
  color,
  mastColor,
  sailColor,
}: ShipSpriteProps) => {
  const { frameHeight, frameWidth, key } = getShipInfo(size)
  const ship = scene.textures.addDynamicTexture(name, frameWidth, frameHeight)
  if (!ship) throw Error("Failed adding dynamic texture")
  ship.stamp(key, ShipColor[color])
  ship.stamp(
    mast.key,
    MastColor[mastColor],
    frameWidth / 2 - 16,
    frameHeight / 2 - 16
  )
  ship.stamp(
    sails.key,
    SailColor[sailColor],
    frameWidth / 2 - 12,
    frameHeight / 2 - 16
  )
}

const getShipInfo = (size: ShipSize) => {
  switch (size) {
    case "small": {
      const { key, frameConfig } = smallShip
      const { frameHeight, frameWidth } = frameConfig
      return { key, frameHeight, frameWidth }
    }
    case "medium": {
      const { key, frameConfig } = mediumShip
      const { frameHeight, frameWidth } = frameConfig
      return { key, frameHeight, frameWidth }
    }
    case "large": {
      const { key, frameConfig } = largeShip
      const { frameHeight, frameWidth } = frameConfig
      return { key, frameHeight, frameWidth }
    }
  }
}
