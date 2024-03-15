import React from "react"
import { ShipSize } from "../../types"

export interface IScore {
  onClick: (size: ShipSize) => void
}
function Score(props: IScore) {
  return (
    <div>
      <button onClick={() => props.onClick("small")}>Small</button>
      <button onClick={() => props.onClick("medium")}>Medium</button>
      <button onClick={() => props.onClick("large")}>Large</button>
    </div>
  )
}

export default Score
