import React from "react"
import { ShipSize } from "../../types"

interface IScore {
  onClick: () => void
}
function Score(props: IScore) {
  return <button onClick={props.onClick}>Change ship size</button>
}

export default Score
