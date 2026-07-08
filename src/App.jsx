import { useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import { loadGame, saveGame } from './systems/saveSystem'
import { startGameLoop } from './systems/gameLoop'

import StatsBar from './components/StatsBar'
import NewsTicker from './components/NewsTicker'
import HeatBar from './components/HeatBar'
import ClickArea from './components/ClickArea'
import BuildingList from './components/BuildingList'
import UpgradePanel from './components/UpgradePanel'
import PrestigePanel from './components/PrestigePanel'
import AchievementsPanel from './components/AchievementsPanel'
import SaveMenu from './components/SaveMenu'
import OfflineModal from './components/OfflineModal'
import ActiveEvent from './components/ActiveEvent'

export default function App() {
  useEffect(() => {
    loadGame()
    useGameStore.getState().recomputeStats()
    saveGame() // persist fresh timestamp so a StrictMode re-mount won't double-grant offline
    const stop = startGameLoop()
    return stop
  }, [])

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col text-slate-200">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black tracking-tight text-emerald-400">
            AI<span className="text-slate-100"> TYCOON</span>
            <span className="mono ml-2 text-[10px] font-normal text-emerald-600">
              v0.1
            </span>
          </h1>
          <ActiveEvent />
        </div>
        <SaveMenu />
      </header>

      <StatsBar />
      <NewsTicker />
      <HeatBar />

      {/* Main */}
      <main className="grid flex-1 grid-cols-1 gap-4 p-3 lg:grid-cols-[1fr_1.1fr_1fr]">
        {/* Left: click + prestige + achievements */}
        <div className="flex flex-col gap-4">
          <ClickArea />
          <PrestigePanel />
          <AchievementsPanel />
        </div>

        {/* Center: hardware */}
        <div className="rounded-xl border border-white/5 bg-black/20 p-3">
          <BuildingList />
        </div>

        {/* Right: upgrades */}
        <div className="rounded-xl border border-white/5 bg-black/20 p-3">
          <UpgradePanel />
        </div>
      </main>

      <footer className="px-3 py-2 text-center text-[10px] text-slate-600">
        Autosaves every 10s · built with React + Zustand · click the terminal to
        generate compute
      </footer>

      <OfflineModal />
    </div>
  )
}
