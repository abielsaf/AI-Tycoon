import { useGameStore } from '../store/gameStore'

// Inline SVG flags — emoji flags don't render on Windows, so we draw them.
function FlagUK() {
  return (
    <svg viewBox="0 0 60 30" width="20" height="13" className="rounded-[2px]">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

function FlagES() {
  return (
    <svg viewBox="0 0 3 2" width="20" height="13" className="rounded-[2px]">
      <rect width="3" height="2" fill="#AA151B" />
      <rect y="0.5" width="3" height="1" fill="#F1BF00" />
    </svg>
  )
}

// EN/ES switch. Persisted with the save (see store `lang`). Shows the flag of
// the currently active language.
export default function LanguageToggle() {
  const lang = useGameStore((s) => s.lang)
  const setLang = useGameStore((s) => s.setLang)

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
      className="mono flex items-center gap-1.5 rounded border border-slate-600/60 px-2 py-1 text-[11px] font-bold text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
    >
      {lang === 'en' ? <FlagUK /> : <FlagES />}
      {lang === 'en' ? 'EN' : 'ES'}
    </button>
  )
}
