import { useGameStore } from '../store/gameStore'
import { fmt, fmtMoney } from '../utils/format'
import { t } from '../i18n'

function Stat({ label, value, accent }) {
  return (
    <div className="flex flex-col items-start px-2 py-1.5 sm:px-4 sm:py-2">
      <span className="text-[10px] uppercase tracking-widest text-emerald-500/60">
        {label}
      </span>
      <span className={`mono text-base font-semibold sm:text-lg ${accent}`}>
        {value}
      </span>
    </div>
  )
}

export default function StatsBar() {
  const money = useGameStore((s) => s.money)
  const lifetime = useGameStore((s) => s.lifetimeCompute)
  const insights = useGameStore((s) => s.insights)
  const stats = useGameStore((s) => s.stats)
  const lang = useGameStore((s) => s.lang)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 bg-black/40 px-2 py-1 backdrop-blur">
      <Stat label={t(lang, 'statMoney')} value={fmtMoney(money)} accent="text-emerald-400" />
      <Stat
        label={t(lang, 'statPerSec')}
        value={fmtMoney(stats?.moneyPerSec || 0) + '/s'}
        accent="text-emerald-300/80"
      />
      <Stat
        label={t(lang, 'statFlops')}
        value={fmt(stats?.flopsPerSec || 0) + '/s'}
        accent="text-cyan-300"
      />
      <Stat label={t(lang, 'statLifetime')} value={fmt(lifetime)} accent="text-cyan-400/70" />
      <Stat
        label={t(lang, 'statInsights')}
        value={fmt(insights)}
        accent="text-fuchsia-400"
      />
    </div>
  )
}
