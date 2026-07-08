import { useState } from 'react'
import { isMuted, setMuted, playEventSound } from '../systems/sound'
import { useGameStore } from '../store/gameStore'
import { t } from '../i18n'

// Mute state lives in localStorage (see sound.js), independent of the game save.
export default function MuteToggle() {
  const lang = useGameStore((s) => s.lang)
  const [muted, setMutedState] = useState(isMuted())

  const toggle = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
    if (!next) playEventSound(true) // audible confirmation when unmuting
  }

  return (
    <button
      onClick={toggle}
      title={muted ? t(lang, 'muteOff') : t(lang, 'muteOn')}
      className="rounded border border-slate-600/60 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
