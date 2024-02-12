import { Component } from "solid-js"
import gameConfig from "./gameConfig"

const GameScreen: Component = () => {
  return <div id={gameConfig.parent}></div>
}

export default GameScreen
