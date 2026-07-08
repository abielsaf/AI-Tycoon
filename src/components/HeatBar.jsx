import { useGameStore } from '../store/gameStore'
import { fmt } from '../utils/format'
import { t } from '../i18n'

export default function HeatBar() {
  const stats = useGameStore((s) => s.stats)
  const lang = useGameStore((s) => s.lang)
  const heat = stats?.heat || 0
  const cooling = stats?.cooling || 0
  const ratio = cooling > 0 ? heat / cooling : 0
  const pct = Math.min(100, ratio * 100)
  const overheating = heat > cooling && heat > 0
  const penalty = stats?.heatPenalty ?? 1

  // blue (cool) -> red (hot) gradient position via hue
  const hue = Math.max(0, 210 - ratio * 210) // 210=blue down to 0=red
  const barColor = `hsl(${hue}, 90%, 55%)`

  return (
    <div className="px-3 py-2">
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="uppercase tracking-widest text-emerald-500/70">
          {t(lang, 'thermals')}
        </span>
        <span className="mono text-slate-300">
          {fmt(heat)} / {fmt(cooling)} {t(lang, 'heat')}
          {overheating && (
            <span className="ml-2 font-bold text-red-400">
              ⚠ {t(lang, 'throttled')} {Math.round((1 - penalty) * 100)}%
            </span>
          )}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-inset ring-white/5">
        <div
          className={`h-full rounded-full transition-all duration-200 ${overheating ? 'pulse-glow' : ''}`}
          style={{
            width: `${pct}%`,
            background: overheating
              ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
              : barColor,
          }}
        />
      </div>
    </div>
  )
}
