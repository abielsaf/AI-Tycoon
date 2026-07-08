import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { playEventSound } from '../systems/sound'

// Pops a dismissible toast when an event fires, and plays a cue. Keys off
// eventFlash.n so repeated events still retrigger. Visibility is derived
// (flash.n vs the last dismissed n) rather than mirrored into state.
export default function EventToast() {
  const flash = useGameStore((s) => s.eventFlash)
  const [dismissed, setDismissed] = useState(0)

  useEffect(() => {
    if (!flash) return
    playEventSound(flash.good)
    const id = setTimeout(() => setDismissed(flash.n), 6000)
    return () => clearTimeout(id)
  }, [flash])

  if (!flash || flash.n === dismissed) return null

  const tone = flash.good
    ? 'border-emerald-400/60 bg-emerald-950/90 text-emerald-100'
    : 'border-rose-400/60 bg-rose-950/90 text-rose-100'

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <button
        onClick={() => setDismissed(flash.n)}
        className={`event-toast pointer-events-auto flex max-w-md items-center gap-3 rounded-lg border px-4 py-2.5 shadow-lg backdrop-blur ${tone}`}
      >
        <span className="text-xl">{flash.good ? '🎉' : '⚠️'}</span>
        <div className="text-left">
          <div className="text-sm font-bold">{flash.title}</div>
          <div className="text-[11px] opacity-80">{flash.headline}</div>
        </div>
      </button>
    </div>
  )
}
