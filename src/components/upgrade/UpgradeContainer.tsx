import React from "react"
import { observer } from "mobx-react-lite"
import { playerStore } from "../../store/player.store"
import LevelInfo from "./LevelInfo"

const UpgradeContainer = observer(() => {
  return (
    <div
      style={{
        pointerEvents: "auto",
        width: "100%",
        padding: "8px",
        backgroundColor: "black",
        color: "white",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: "8px",
      }}
    >
      <div
        style={{
          alignSelf: "center",
          justifySelf: "center",
          padding: "8px",
          backgroundColor: "#facc15",
          borderRadius: "8px",
          color: "black",
        }}
      >
        Gold: ${playerStore.gold}
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <LevelInfo
          onUpgrade={(cost) => playerStore.levelUp("hullLevel", cost)}
          currentLevel={playerStore.progression.hullLevel}
          playerGold={playerStore.gold}
          stat="Hull"
        />
        <LevelInfo
          onUpgrade={(cost) => playerStore.levelUp("cannonLevel", cost)}
          currentLevel={playerStore.progression.cannonLevel}
          playerGold={playerStore.gold}
          stat="Cannon"
        />
        <LevelInfo
          onUpgrade={(cost) => playerStore.levelUp("sailLevel", cost)}
          currentLevel={playerStore.progression.sailLevel}
          playerGold={playerStore.gold}
          stat="Sail"
        />
        <LevelInfo
          onUpgrade={(cost) => playerStore.levelUp("bodyLevel", cost)}
          currentLevel={playerStore.progression.bodyLevel}
          playerGold={playerStore.gold}
          stat="Ship"
        />
      </div>
      <div />
    </div>
  )
})

export default UpgradeContainer
