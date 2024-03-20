import { observer } from "mobx-react-lite"
import React from "react"
import { playerStore } from "../store/player.store"

const Experience = observer(() => {
  return <div>{playerStore.experience}</div>
})

export default Experience
