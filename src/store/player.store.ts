import { makeAutoObservable } from "mobx"
import { MastColor, SailColor, ShipColor, ShipSize } from "../types"
import { upgradeMap } from "../components/upgrade/upgradeMap"

export interface ShipData {
  size: ShipSize
  color: keyof typeof ShipColor
  mastColor: keyof typeof MastColor
  sailColor: keyof typeof SailColor
  cannonCount: number
}

interface Progression {
  bodyLevel: number
  sailLevel: number
  hullLevel: number
  cannonLevel: number
}

interface PlayerStoreData {
  progression: Progression
  gold: number
  ship: ShipData
}
interface PlayerStore extends PlayerStoreData {
  addGold: (amount: number) => void
  levelUp: (stat: keyof Progression, cost: number) => void
}

const startProgression: Progression = {
  bodyLevel: 0,
  cannonLevel: 0,
  hullLevel: 0,
  sailLevel: 0,
}
const initialData: PlayerStoreData = {
  progression: startProgression,
  ship: getShipFromLevel(startProgression),
  gold: 1000000,
}

export const playerStore = makeAutoObservable<PlayerStore>({
  ...initialData,
  addGold(amount) {
    this.gold += amount
  },
  levelUp(stat, cost) {
    const newProgression = updateProgression(stat, this.progression)
    this.progression = newProgression
    this.ship = getShipFromLevel(newProgression)
    this.gold = this.gold - cost
  },
})

function getShipFromLevel(progression: Progression): ShipData {
  return {
    color: upgradeMap.Hull[progression.hullLevel].color,
    mastColor: "wood",
    sailColor: upgradeMap.Sail[progression.sailLevel].color,
    size: upgradeMap.Ship[progression.bodyLevel].size,
    cannonCount: upgradeMap.Cannon[progression.cannonLevel].cannonCount,
  }
}

function updateProgression(
  stat: keyof Progression,
  prevProgression: Progression
): Progression {
  switch (stat) {
    case "bodyLevel": {
      return {
        bodyLevel: prevProgression.bodyLevel + 1,
        cannonLevel: prevProgression.bodyLevel + 1,
        hullLevel: 0,
        sailLevel: 0,
      }
    }
    case "cannonLevel":
      return {
        ...prevProgression,
        cannonLevel: prevProgression.cannonLevel + 1,
      }
    case "hullLevel":
      return {
        ...prevProgression,
        hullLevel: prevProgression.hullLevel + 1,
      }
    case "sailLevel":
      return {
        ...prevProgression,
        sailLevel: prevProgression.sailLevel + 1,
      }
  }
}
