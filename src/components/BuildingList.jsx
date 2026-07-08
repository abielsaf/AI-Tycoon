import { useGameStore, buildingCost, bulkCost, maxAffordable } from '../store/gameStore'
import { BUILDINGS } from '../data/buildings'
import { fmt, fmtMoney } from '../utils/format'

function Row({ b }) {
  const owned = useGameStore((s) => s.buildings[b.id] || 0)
  const money = useGameStore((s) => s.money)
  const costMult = useGameStore((s) => s.stats?.costMult || 1)
  const buyMode = useGameStore((s) => s.buyMode)
  const buy = useGameStore((s) => s.buyBuilding)

  // hide buildings well beyond reach until the player is close (progressive reveal)
  const revealed = owned > 0 || money >= b.baseCost * 0.4
  if (!revealed) return null

  const affordableAll = maxAffordable(b.id, owned, money, costMult) // {count, cost}
  // qty to buy this click depends on the selected mode
  const qty = buyMode === 'max' ? affordableAll.count : buyMode
  const cost =
    buyMode === 'max' ? affordableAll.cost : bulkCost(b.id, owned, qty, costMult)
  const affordable = qty >= 1 && money >= cost
  // price of the very next single unit, shown when Max can't afford any
  const nextCost = buildingCost(b.id, owned, costMult)

  return (
    <button
      onClick={() => affordable && buy(b.id, qty)}
      disabled={!affordable}
      className={`group flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
        affordable
          ? 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400/60 hover:bg-emerald-900/30'
          : 'cursor-not-allowed border-slate-700/40 bg-slate-900/30 opacity-60'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-semibold text-slate-100">{b.name}</span>
          <span className="mono text-xs text-emerald-400/70">×{owned}</span>
          {affordableAll.count > 0 && (
            <span className="mono text-[10px] text-slate-500">
              (can buy {affordableAll.count})
            </span>
          )}
        </div>
        <div className="truncate text-[11px] text-slate-400">{b.desc}</div>
        <div className="mono mt-0.5 flex gap-3 text-[10px] text-slate-500">
          {b.flops > 0 && <span className="text-cyan-400/70">{fmt(b.flops)} FLOPS/s</span>}
          {b.cooling > 0 && <span className="text-sky-400/70">+{fmt(b.cooling)} cooling</span>}
          {b.heat > 0 && <span className="text-orange-400/60">{fmt(b.heat)} heat</span>}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div
          className={`mono text-sm font-bold ${affordable ? 'text-emerald-300' : 'text-slate-500'}`}
        >
          {fmtMoney(affordable ? cost : nextCost)}
        </div>
        {qty > 1 && (
          <div className="mono text-[10px] text-emerald-400/60">
            buy ×{qty}
          </div>
        )}
      </div>
    </button>
  )
}

function ModeToggle() {
  const buyMode = useGameStore((s) => s.buyMode)
  const setBuyMode = useGameStore((s) => s.setBuyMode)
  const modes = [
    [1, '×1'],
    [10, '×10'],
    ['max', 'MAX'],
  ]
  return (
    <div className="flex gap-1">
      {modes.map(([m, label]) => (
        <button
          key={m}
          onClick={() => setBuyMode(m)}
          className={`mono rounded px-2 py-0.5 text-[11px] font-bold transition ${
            buyMode === m
              ? 'bg-emerald-500/80 text-black'
              : 'border border-emerald-500/30 text-emerald-400/70 hover:border-emerald-400/60'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function BuildingList() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-500/70">
          Hardware
        </h2>
        <ModeToggle />
      </div>
      {BUILDINGS.map((b) => (
        <Row key={b.id} b={b} />
      ))}
    </div>
  )
}
