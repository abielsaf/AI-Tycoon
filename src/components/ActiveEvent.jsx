import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function ActiveEvent() {
  const event = useGameStore((s) => s.activeEvent)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!event) return
    const update = () =>
      setRemaining(Math.max(0, Math.ceil(event.endsAt - Date.now() / 1000)))
    update()
    const id = setInterval(update, 500)
    return () => clearInterval(id)
  }, [event])

  if (!event) return null

  return (
    <div className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-950/40 px-3 py-1 text-[11px] text-amber-200">
      <span className="pulse-glow inline-block h-2 w-2 rounded-full bg-amber-400" />
      <span className="font-semibold">{event.title}</span>
      <span className="mono text-amber-400/70">{remaining}s</span>
    </div>
  )
}
