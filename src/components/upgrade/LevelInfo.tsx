import React from "react"
import { upgradeMap } from "./upgradeMap"

const LevelInfo = (props: {
  stat: keyof typeof upgradeMap
  currentLevel: number
  playerGold: number
  onUpgrade: (cost: number) => void
  otherBlock?: boolean
}) => {
  const max = upgradeMap[props.stat].length - 1 === props.currentLevel
  const upgrade = upgradeMap[props.stat]
  const nextCost = max ? 0 : upgrade[props.currentLevel + 1].cost
  const disabled = props.playerGold < nextCost || props.otherBlock || max
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p>
        {props.stat}: Lvl {props.currentLevel + 1}
      </p>
      <button
        style={{
          width: "100px",
          borderRadius: "4px",
          backgroundColor: disabled ? "#4b5563" : "#16a34a",
          fontSize: "14px",
          lineHeight: 1,
          padding: "4px",
        }}
        disabled={disabled}
        onClick={() => props.onUpgrade(nextCost)}
      >
        {max ? "MAX" : "$" + nextCost}
      </button>
    </div>
  )
}

export default LevelInfo
