import { useState, useRef, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { BUILDINGS } from '../data/buildings'
import { fmt } from '../utils/format'
import { t } from '../i18n'

let floatId = 0

// Highest compute tier the player owns drives the click icon (visual progression).
function computeIcon(buildings) {
  let icon = '🖥️'
  for (const b of BUILDINGS) {
    if (b.flops > 0 && (buildings[b.id] || 0) > 0) icon = b.icon
  }
  return icon
}

export default function ClickArea() {
  const click = useGameStore((s) => s.click)
  const clickPower = useGameStore((s) => s.stats?.clickPower || 1)
  const icon = useGameStore((s) => computeIcon(s.buildings))
  const lang = useGameStore((s) => s.lang)
  const [floats, setFloats] = useState([])
  const areaRef = useRef(null)

  const handleClick = useCallback(
    (e) => {
      click()
      const rect = areaRef.current?.getBoundingClientRect()
      const x = rect ? e.clientX - rect.left : 100
      const y = rect ? e.clientY - rect.top : 100
      const id = floatId++
      const amount = useGameStore.getState().stats?.clickPower || clickPower
      setFloats((f) => [...f, { id, x, y, amount }])
      setTimeout(() => {
        setFloats((f) => f.filter((n) => n.id !== id))
      }, 1000)
    },
    [click, clickPower]
  )

  return (
    <div
      ref={areaRef}
      onClick={handleClick}
      className="click-target relative flex cursor-pointer select-none flex-col items-center justify-center overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-black/60 py-10 transition active:brightness-125"
    >
      <div className="text-6xl">{icon}</div>
      <div className="mt-3 text-lg font-bold uppercase tracking-widest text-emerald-300">
        {t(lang, 'compute')}
      </div>
      <div className="mono mt-1 text-sm text-emerald-500/70">
        +{fmt(clickPower)} {t(lang, 'perClick')}
      </div>
      {floats.map((f) => (
        <span
          key={f.id}
          className="float-num mono absolute text-lg font-bold text-cyan-300"
          style={{ left: f.x, top: f.y }}
        >
          +{fmt(f.amount)}
        </span>
      ))}
    </div>
  )
}
