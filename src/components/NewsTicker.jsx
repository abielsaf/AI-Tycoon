import { useGameStore } from '../store/gameStore'
import { FLAVOR_HEADLINES } from '../data/events'

export default function NewsTicker() {
  const news = useGameStore((s) => s.news)
  // seed with flavor so the ticker is never empty
  const items = news.length ? news.map((n) => n.text) : FLAVOR_HEADLINES
  const line = items.join('     ///     ')

  return (
    <div className="flex items-stretch overflow-hidden border-y border-emerald-500/20 bg-black/60">
      <div className="flex shrink-0 items-center bg-emerald-500/10 px-3 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
        ● Live
      </div>
      <div className="relative flex-1 overflow-hidden py-1.5">
        <div className="ticker-track mono text-xs text-emerald-200/80">
          <span className="px-6">{line}</span>
          <span className="px-6">{line}</span>
        </div>
      </div>
    </div>
  )
}
