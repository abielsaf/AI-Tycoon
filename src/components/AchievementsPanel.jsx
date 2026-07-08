import { useGameStore } from '../store/gameStore'
import { ACHIEVEMENTS } from '../data/achievements'
import { t, tc } from '../i18n'

export default function AchievementsPanel() {
  const unlocked = useGameStore((s) => s.achievements)
  const lang = useGameStore((s) => s.lang)

  return (
    <div className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-amber-500/70">
        {t(lang, 'achievements')}{' '}
        <span className="text-slate-600">
          ({unlocked.length}/{ACHIEVEMENTS.length})
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-1.5">
        {ACHIEVEMENTS.map((a) => {
          const got = unlocked.includes(a.id)
          return (
            <div
              key={a.id}
              className={`rounded border px-2.5 py-1.5 ${
                got
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-slate-700/40 bg-slate-900/20 opacity-50'
              }`}
            >
              <div
                className={`text-xs font-semibold ${got ? 'text-amber-300' : 'text-slate-400'}`}
              >
                {got ? '🏆' : '🔒'} {tc(lang, 'achievements', a.id, 'name', a.name)}
              </div>
              <div className="text-[10px] text-slate-500">
                {tc(lang, 'achievements', a.id, 'desc', a.desc)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
