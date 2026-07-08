import { useState, useRef, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { fmt } from '../utils/format'

let floatId = 0

export default function ClickArea() {
  const click = useGameStore((s) => s.click)
  const clickPower = useGameStore((s) => s.stats?.clickPower || 1)
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
      <div className="text-6xl">🖥️</div>
      <div className="mt-3 text-lg font-bold uppercase tracking-widest text-emerald-300">
        Compute
      </div>
      <div className="mono mt-1 text-sm text-emerald-500/70">
        +{fmt(clickPower)} FLOPS / click
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
