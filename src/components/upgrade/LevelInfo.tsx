import React from "react"
import { upgradeMap } from "./upgradeMap"

const LevelInfo = (props: {
  stat: keyof typeof upgradeMap
  currentLevel: number
  playerGold: number
  onUpgrade: (cost: number) => void
}) => {
  const upgrade = upgradeMap[props.stat]
  const nextCost = upgrade[props.currentLevel + 1].cost
  const noMoney = props.playerGold < nextCost
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
          backgroundColor: noMoney ? "#4b5563" : "#16a34a",
          fontSize: "14px",
          lineHeight: 1,
          padding: "4px",
        }}
        disabled={noMoney}
        onClick={() => props.onUpgrade(nextCost)}
      >
        ${nextCost}
      </button>
    </div>
  )
}

export default LevelInfo
