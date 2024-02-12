import { Show, createSignal, onCleanup, onMount } from "solid-js"
import GameScreen from "./GameScreen"
import gameConfig from "./gameConfig"

function App() {
  const [game, setGame] = createSignal<Phaser.Game | null>(null)

  onMount(() => {
    console.log("mount")
    const newGame = new Phaser.Game(gameConfig)
    setGame(newGame)
  })

  onCleanup(() => {
    console.log("clean")
    game()?.destroy(true)
    setGame(null)
  })

  return (
    <div class="flex items-center justify-center w-full">
      <Show when={game()}>
        <GameScreen />
      </Show>
    </div>
  )
}

export default App
