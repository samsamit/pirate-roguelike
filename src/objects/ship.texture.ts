import { ShipData } from "../store/player.store"
import { MastColor, SailColor, ShipColor, Size } from "../types"
import { mast, sails } from "../util/parseShipSprites"

class ShipTexture {
  public texture: Phaser.Textures.DynamicTexture
  constructor(scene: Phaser.Scene, shipName: string) {
    const texture = scene.textures.addDynamicTexture(shipName)
    if (!texture) throw Error("Failed to create texture for ship " + shipName)
    this.texture = texture
  }

  build(
    shipData: ShipData,
    size: Size,
    baseTextureKey: string,
    damage: 0 | 1 | 2 = 0
  ) {
    const { color, mastColor, sailColor } = shipData
    // Update texture
    this.texture.clear()
    this.texture.setSize(size.width, size.height)
    this.texture.camera.setPosition(size.width / 2, size.height / 2)
    this.texture.stamp(baseTextureKey, ShipColor[color] + damage)
    this.texture.stamp(mast.key, MastColor[mastColor] + damage)
    this.texture.stamp(sails.key, SailColor[sailColor], 4, 0)
  }
}

export default ShipTexture
