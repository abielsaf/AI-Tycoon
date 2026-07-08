import { useRef, useState } from 'react'
import { saveGame, exportSave, importSave, wipeSave } from '../systems/saveSystem'
import { useGameStore } from '../store/gameStore'
import { t } from '../i18n'

export default function SaveMenu() {
  const fileRef = useRef(null)
  const hardReset = useGameStore((s) => s.hardReset)
  const lang = useGameStore((s) => s.lang)
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
      if (importSave(String(reader.result))) flash(t(lang, 'imported'))
      else flash(t(lang, 'importFailed'))
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const btn =
    'rounded border border-slate-600/60 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={btn} onClick={() => { saveGame(); flash(t(lang, 'saved')) }}>
        {t(lang, 'save')}
      </button>
      <button className={btn} onClick={exportSave}>
        {t(lang, 'export')}
      </button>
      <button className={btn} onClick={() => fileRef.current?.click()}>
        {t(lang, 'import')}
      </button>
      <button
        className={`${btn} hover:!border-red-500/60 hover:!text-red-400`}
        onClick={() => {
          if (confirm(t(lang, 'wipeConfirm'))) {
            wipeSave()
            hardReset()
            flash(t(lang, 'wiped'))
          }
        }}
      >
        {t(lang, 'reset')}
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
