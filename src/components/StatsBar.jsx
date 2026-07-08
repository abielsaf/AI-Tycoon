import { useGameStore } from '../store/gameStore'
import { fmt, fmtMoney } from '../utils/format'

function Stat({ label, value, accent }) {
  return (
    <div className="flex flex-col items-start px-4 py-2">
      <span className="text-[10px] uppercase tracking-widest text-emerald-500/60">
        {label}
      </span>
      <span className={`mono text-lg font-semibold ${accent}`}>{value}</span>
    </div>
  )
}

export default function StatsBar() {
  const money = useGameStore((s) => s.money)
  const lifetime = useGameStore((s) => s.lifetimeCompute)
  const insights = useGameStore((s) => s.insights)
  const stats = useGameStore((s) => s.stats)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 bg-black/40 px-2 py-1 backdrop-blur">
      <Stat label="Money" value={fmtMoney(money)} accent="text-emerald-400" />
      <Stat
        label="$ / sec"
        value={fmtMoney(stats?.moneyPerSec || 0) + '/s'}
        accent="text-emerald-300/80"
      />
      <Stat
        label="FLOPS / sec"
        value={fmt(stats?.flopsPerSec || 0) + '/s'}
        accent="text-cyan-300"
      />
      <Stat label="Lifetime FLOPS" value={fmt(lifetime)} accent="text-cyan-400/70" />
      <Stat
        label="AI Insights"
        value={fmt(insights)}
        accent="text-fuchsia-400"
      />
      {insights > 0 && (
        <Stat
          label="Insight Bonus"
          value={`+${Math.round(insights * 2)}%`}
          accent="text-fuchsia-300/70"
        />
      )}
    </div>
  )
}
