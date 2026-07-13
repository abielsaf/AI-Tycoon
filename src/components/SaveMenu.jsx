import { useRef, useState } from 'react'
import { saveGame, exportSave, exportString, importSave, wipeSave } from '../systems/saveSystem'
import { useGameStore } from '../store/gameStore'
import { t } from '../i18n'

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-emerald-500/40 bg-slate-950 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-2 text-lg leading-none text-slate-500 hover:text-slate-200"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export default function SaveMenu() {
  const fileRef = useRef(null)
  const hardReset = useGameStore((s) => s.hardReset)
  const lang = useGameStore((s) => s.lang)
  const [msg, setMsg] = useState('')
  const [modal, setModal] = useState(null) // 'export' | 'import' | null
  const [pasteText, setPasteText] = useState('')

  const flash = (m) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 2500)
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importSave(String(reader.result))
      flash(ok ? t(lang, 'imported') : t(lang, 'importFailed'))
      if (ok) setModal(null)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportString())
      flash(t(lang, 'copied'))
    } catch {
      flash(t(lang, 'copyFailed'))
    }
  }

  const onLoad = () => {
    const ok = importSave(pasteText)
    flash(ok ? t(lang, 'imported') : t(lang, 'importFailed'))
    if (ok) {
      setModal(null)
      setPasteText('')
    }
  }

  const btn =
    'rounded border border-slate-600/60 px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300'
  const action =
    'flex-1 rounded bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={btn} onClick={() => { saveGame(); flash(t(lang, 'saved')) }}>
        {t(lang, 'save')}
      </button>
      <button className={btn} onClick={() => setModal('export')}>
        {t(lang, 'export')}
      </button>
      <button className={btn} onClick={() => { setPasteText(''); setModal('import') }}>
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
      {msg && <span className="mono text-[11px] text-emerald-400">{msg}</span>}

      <input
        ref={fileRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={onFile}
      />

      {modal === 'export' && (
        <Modal onClose={() => setModal(null)}>
          <h2 className="text-base font-bold text-emerald-300">{t(lang, 'export')}</h2>
          <p className="mt-2 text-xs text-slate-400">{t(lang, 'exportDesc')}</p>
          <textarea
            readOnly
            value={exportString()}
            onClick={(e) => e.target.select()}
            rows={3}
            className="mono mt-4 w-full resize-none break-all rounded border border-slate-600/60 bg-black/40 p-2 text-[11px] text-slate-300 outline-none"
          />
          <div className="mt-4 flex gap-2">
            <button className={action} onClick={exportSave}>{t(lang, 'download')}</button>
            <button className={action} onClick={onCopy}>{t(lang, 'copy')}</button>
          </div>
          {msg && <span className="mono mt-2 block text-center text-[11px] text-emerald-400">{msg}</span>}
        </Modal>
      )}

      {modal === 'import' && (
        <Modal onClose={() => setModal(null)}>
          <h2 className="text-base font-bold text-emerald-300">{t(lang, 'import')}</h2>
          <p className="mt-2 text-xs text-slate-400">{t(lang, 'importDesc')}</p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={t(lang, 'pastePlaceholder')}
            rows={3}
            className="mono mt-4 w-full resize-none break-all rounded border border-slate-600/60 bg-black/40 p-2 text-[11px] text-slate-200 outline-none focus:border-emerald-500/60"
          />
          <div className="mt-4 flex gap-2">
            <button className={action} onClick={() => fileRef.current?.click()}>
              {t(lang, 'uploadTxt')}
            </button>
            <button className={action} disabled={!pasteText.trim()} onClick={onLoad}>
              {t(lang, 'loadSave')}
            </button>
          </div>
          {msg && <span className="mono mt-2 block text-center text-[11px] text-emerald-400">{msg}</span>}
        </Modal>
      )}
    </div>
  )
}
