export type ShipSize = "small" | "medium" | "large"

export const ShipColor = {
  gold: 0,
  blue: 3,
  mahong: 6,
  lightWood: 9,
  wood: 12,
  grey: 15,
}

export const MastColor = {
  gold: 0,
  silver: 4,
  mahong: 8,
  lightWood: 12,
  wood: 16,
  gray: 20,
}

export const SailColor = {
  red: 6,
  blue: 14,
  yellow: 22,
  green: 30,
  white: 38,
  grey: 46,
}

export interface ShipPhysics {
  acceleration: number
  topSpeed: number
  turnSpeed: number
  mass: number
}
