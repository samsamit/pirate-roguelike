import { makeAutoObservable } from "mobx"
import { MastColor, SailColor, ShipColor, ShipSize } from "../types"

export interface ShipData {
  size: ShipSize
  color: keyof typeof ShipColor
  mastColor: keyof typeof MastColor
  sailColor: keyof typeof SailColor
}
interface PlayerStoreActions {
  addExperience: (amount: number) => void
  updateShip: (shipData: Partial<ShipData>) => void
}
interface PlayerStore extends PlayerStoreActions {
  experience: number
  ship: ShipData
}

export const playerStore = makeAutoObservable<PlayerStore>({
  experience: 0,
  ship: {
    color: "wood",
    mastColor: "wood",
    sailColor: "white",
    size: "small",
  },
  addExperience(amount) {
    this.experience += amount
  },
  updateShip(shipData) {
    this.ship = { ...this.ship, ...shipData }
  },
})
