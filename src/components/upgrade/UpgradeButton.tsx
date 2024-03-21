import React from "react"

const UpgradeButton = (props: {
  label: string
  cost: number
  disabled: boolean
}) => {
  return (
    <button
      style={{
        minWidth: "100px",
        padding: "4px 16px",
        borderRadius: "8px",
        border: props.disabled ? "1px dashed red" : "1px white solid",
        backgroundColor: props.disabled ? "lightsalmon" : "greenyellow",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
      disabled={props.disabled}
    >
      {props.label}
      <span>{props.cost}$</span>
    </button>
  )
}

export default UpgradeButton
