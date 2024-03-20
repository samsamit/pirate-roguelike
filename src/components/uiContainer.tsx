import React from "react"
import Experience from "./experience"

const UiContainer = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: "1px solid black",
        display: "flex",
        pointerEvents: "none",
      }}
    >
      <Experience />
    </div>
  )
}

export default UiContainer
