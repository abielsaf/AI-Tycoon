import { useGameStore } from '../store/gameStore'
import { UPGRADES } from '../data/upgrades'
import { fmtMoney } from '../utils/format'

function reqMet(u, s) {
  if (!u.req) return true
  const r = u.req
  if (r.building) return (s.buildings[r.building] || 0) >= r.count
  if (r.clicks) return s.clicks >= r.clicks
  if (r.money) return s.allTimeCompute >= r.money
  return true
}

export default function UpgradePanel() {
  const owned = useGameStore((s) => s.upgrades)
  const money = useGameStore((s) => s.money)
  const buy = useGameStore((s) => s.buyUpgrade)
  const state = useGameStore()

  const available = UPGRADES.filter(
    (u) => !owned.includes(u.id) && reqMet(u, state)
  ).sort((a, b) => a.cost - b.cost)

  return (
    <div className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-fuchsia-500/70">
        Upgrades <span className="text-slate-600">({owned.length} owned)</span>
      </h2>
      {available.length === 0 && (
        <p className="px-1 text-[11px] text-slate-500">
          No upgrades available yet — buy more hardware to unlock them.
        </p>
      )}
      {available.map((u) => {
        const affordable = money >= u.cost
        return (
          <button
            key={u.id}
            onClick={() => buy(u.id)}
            disabled={!affordable}
            className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
              affordable
                ? 'border-fuchsia-500/30 bg-fuchsia-950/20 hover:border-fuchsia-400/60 hover:bg-fuchsia-900/25'
                : 'cursor-not-allowed border-slate-700/40 bg-slate-900/30 opacity-60'
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-slate-100">{u.name}</div>
              <div className="truncate text-[11px] text-slate-400">{u.desc}</div>
            </div>
            <div
              className={`mono shrink-0 text-sm font-bold ${affordable ? 'text-fuchsia-300' : 'text-slate-500'}`}
            >
              {fmtMoney(u.cost)}
            </div>
          </button>
        )
      })}
    </div>
  )
}
