import { useState } from 'react'
import { useGameStore, pendingInsights, PRESTIGE_UNLOCK } from '../store/gameStore'
import { fmt } from '../utils/format'

export default function PrestigePanel() {
  const lifetime = useGameStore((s) => s.lifetimeCompute)
  const insights = useGameStore((s) => s.insights)
  const prestige = useGameStore((s) => s.prestige)
  const [confirming, setConfirming] = useState(false)

  const pending = pendingInsights(lifetime)
  const unlocked = pending >= 1

  return (
    <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/20 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
          🌌 Singularity Reset
        </h2>
        <span className="mono text-xs text-fuchsia-300/70">
          {fmt(insights)} owned
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-slate-400">
        Reset all hardware, upgrades and money for permanent{' '}
        <span className="text-fuchsia-300">AI Insights</span> (+2% production
        each).
      </p>

      {unlocked ? (
        <>
          <div className="mono mt-2 text-sm text-fuchsia-200">
            Reset now for <span className="font-bold">+{fmt(pending)}</span>{' '}
            Insights
          </div>
          {confirming ? (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  prestige()
                  setConfirming(false)
                }}
                className="flex-1 rounded bg-fuchsia-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-fuchsia-500"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="pulse-glow mt-2 w-full rounded bg-fuchsia-600/90 px-3 py-1.5 text-xs font-bold text-white hover:bg-fuchsia-500"
            >
              Trigger Singularity
            </button>
          )}
        </>
      ) : (
        <div className="mono mt-2 text-[11px] text-slate-500">
          Unlocks at {fmt(PRESTIGE_UNLOCK)} lifetime FLOPS ({fmt(lifetime)} so
          far)
        </div>
      )}
    </div>
  )
}
