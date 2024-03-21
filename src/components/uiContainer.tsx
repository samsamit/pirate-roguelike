import React from "react"
import UpgradeContainer from "./upgrade/UpgradeContainer"

const UiContainer = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: "1px solid black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        pointerEvents: "none",
      }}
    >
      <UpgradeContainer />
    </div>
  )
}

export default UiContainer
