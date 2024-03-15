import { makeAutoObservable } from "mobx"
import { MastColor, SailColor, ShipColor, ShipSize } from "../types"

export interface ShipData {
  size: ShipSize
  color: keyof typeof ShipColor
  mastColor: keyof typeof MastColor
  sailColor: keyof typeof SailColor
}
interface PlayerStoreActions {
  updateShip: (shipData: Partial<ShipData>) => void
}
interface PlayerStore extends PlayerStoreActions {
  ship: ShipData
}

export const playerStore = makeAutoObservable<PlayerStore>({
  ship: {
    color: "wood",
    mastColor: "wood",
    sailColor: "white",
    size: "small",
  },
  updateShip(shipData) {
    this.ship = { ...this.ship, ...shipData }
  },
})
