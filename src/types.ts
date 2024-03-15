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

export interface ShipPhysicsData {
  acceleration: number
  turnSpeed: number
  mass: number
  size: Size
}

export interface Position {
  x: number
  y: number
}

export type Side = "left" | "right"

export interface PositionWithAngle {
  position: Position
  angle: number
}

export interface Size {
  width: number
  height: number
}

export interface CollisionRecord {
  ship: number
  projectile: number
}
