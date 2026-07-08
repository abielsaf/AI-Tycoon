import { useGameStore } from '../store/gameStore'
import { FLAVOR_HEADLINES } from '../data/events'
import { t, FLAVOR } from '../i18n'

export default function NewsTicker() {
  const news = useGameStore((s) => s.news)
  const lang = useGameStore((s) => s.lang)
  // seed with flavor so the ticker is never empty
  const seed = FLAVOR[lang] || FLAVOR_HEADLINES
  const items = news.length ? news.map((n) => n.text) : seed
  const line = items.join('     ///     ')

  return (
    <div className="flex items-stretch overflow-hidden border-y border-emerald-500/20 bg-black/60">
      <div className="flex shrink-0 items-center bg-emerald-500/10 px-3 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
        ● {t(lang, 'live')}
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
