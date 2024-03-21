import { SailColor, ShipColor, ShipSize } from "../../types"

export const upgradeMap = {
  Sail: [
    {
      color: "white",
      cost: 0,
    },
    {
      color: "green",
      cost: 100,
    },
    {
      color: "yellow",
      cost: 250,
    },
    {
      color: "blue",
      cost: 500,
    },
    {
      color: "red",
      cost: 1000,
    },
  ] satisfies Array<SailLevel>,
  Hull: [
    {
      color: "wood",
      cost: 0,
    },
    {
      color: "lightWood",
      cost: 100,
    },
    {
      color: "mahong",
      cost: 250,
    },
    {
      color: "blue",
      cost: 500,
    },
    {
      color: "gold",
      cost: 1000,
    },
  ] satisfies Array<HullLevel>,
  Cannon: [
    {
      cannonCount: 2,
      cost: 0,
    },
    {
      cannonCount: 4,
      cost: 100,
    },
    {
      cannonCount: 6,
      cost: 250,
    },
    {
      cannonCount: 8,
      cost: 500,
    },
    {
      cannonCount: 10,
      cost: 1000,
    },
  ] satisfies Array<CannonLevel>,
  Ship: [
    {
      cost: 0,
      size: "small",
    },
    {
      cost: 3000,
      size: "medium",
    },
    {
      cost: 10000,
      size: "large",
    },
  ] satisfies Array<BodyLevel>,
} as const

interface SailLevel {
  cost: number
  color: keyof typeof SailColor
}

interface HullLevel {
  cost: number
  color: keyof typeof ShipColor
}

interface CannonLevel {
  cost: number
  cannonCount: number
}

interface BodyLevel {
  cost: number
  size: ShipSize
}
