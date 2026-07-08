import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useGameStore } from './store/gameStore'
import { loadGame, saveGame } from './systems/saveSystem'
import { startGameLoop } from './systems/gameLoop'
import { SKIN_MAP } from './data/skins'

const GUIDE_KEY = 'ai-tycoon-guide-seen'

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
import EventToast from './components/EventToast'
import MuteToggle from './components/MuteToggle'
import GuideModal from './components/GuideModal'

export default function App() {
  const skin = useGameStore((s) => s.skin)
  // Auto-open the guide for players who haven't seen it (no localStorage flag).
  const [guideOpen, setGuideOpen] = useState(() => !localStorage.getItem(GUIDE_KEY))

  const closeGuide = () => {
    localStorage.setItem(GUIDE_KEY, '1')
    setGuideOpen(false)
  }

  useEffect(() => {
    const loaded = loadGame()
    useGameStore.getState().recomputeStats()
    // Only overwrite storage if we actually loaded — otherwise a failed/empty
    // load would clobber an existing (possibly corrupt-but-recoverable) save.
    // On success this persists a fresh timestamp so a StrictMode re-mount won't
    // double-grant offline progress.
    if (loaded) saveGame()
    const stop = startGameLoop()
    return stop
  }, [])

  // Skins are just a CSS filter over the whole page. Applied to <html> so it
  // recolors the grid backdrop too and doesn't trap fixed-position overlays.
  useEffect(() => {
    document.documentElement.style.filter = SKIN_MAP[skin]?.filter || 'none'
  }, [skin])

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGuideOpen(true)}
            title="How to play"
            className="rounded border border-slate-600/60 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
          >
            ❓ Guide
          </button>
          <MuteToggle />
          <SaveMenu />
        </div>
      </header>

      <StatsBar />
      <NewsTicker />
      <HeatBar />

      {/* Main. Mobile: single-column, ordered Click → Hardware → Upgrades →
          Prestige/Achievements (via `order-*`). Desktop: explicit 3-column
          grid places Click + Prestige/Achievements back into the left column. */}
      <main className="grid flex-1 grid-cols-1 gap-4 p-3 lg:grid-cols-[1fr_1.1fr_1fr] lg:grid-rows-[auto_1fr]">
        {/* Click */}
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          <ClickArea />
        </div>

        {/* Hardware */}
        <div className="order-2 rounded-xl border border-white/5 bg-black/20 p-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <BuildingList />
        </div>

        {/* Upgrades */}
        <div className="order-3 rounded-xl border border-white/5 bg-black/20 p-3 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <UpgradePanel />
        </div>

        {/* Prestige + achievements */}
        <div className="order-4 flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
          <PrestigePanel />
          <AchievementsPanel />
        </div>
      </main>

      <footer className="flex flex-col items-center gap-1 px-3 py-3 text-center text-[10px] text-slate-600">
        <div>
          Autosaves every 10s · built with React + Zustand · click the terminal
          to generate compute
        </div>
        <a
          href="https://github.com/abielsaf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-emerald-400"
        >
          Created by
          <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="font-semibold">abielsaf</span>
        </a>
      </footer>

      <OfflineModal />
      <EventToast />
      <GuideModal open={guideOpen} onClose={closeGuide} />
      <Analytics />
      <SpeedInsights />
    </div>
  )
}
