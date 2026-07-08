import { useRef, useState } from 'react'
import { saveGame, exportSave, importSave, wipeSave } from '../systems/saveSystem'
import { useGameStore } from '../store/gameStore'

export default function SaveMenu() {
  const fileRef = useRef(null)
  const hardReset = useGameStore((s) => s.hardReset)
  const [msg, setMsg] = useState('')

  const flash = (t) => {
    setMsg(t)
    setTimeout(() => setMsg(''), 2500)
  }

  const onImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (importSave(String(reader.result))) flash('Save imported ✓')
      else flash('Import failed ✗')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const btn =
    'rounded border border-slate-600/60 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={btn} onClick={() => { saveGame(); flash('Saved ✓') }}>
        💾 Save
      </button>
      <button className={btn} onClick={exportSave}>
        ⬇ Export
      </button>
      <button className={btn} onClick={() => fileRef.current?.click()}>
        ⬆ Import
      </button>
      <button
        className={`${btn} hover:!border-red-500/60 hover:!text-red-400`}
        onClick={() => {
          if (confirm('Wipe all progress and start over? This cannot be undone.')) {
            wipeSave()
            hardReset()
            flash('Progress wiped')
          }
        }}
      >
        🗑 Reset
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={onImport}
      />
      {msg && <span className="mono text-[11px] text-emerald-400">{msg}</span>}
    </div>
  )
}
