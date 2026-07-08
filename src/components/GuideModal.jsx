import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { t, guideSteps } from '../i18n'

// New-player walkthrough. Content-only steps — no spotlight/anchoring library,
// just a concise stepped modal covering the core loop and mechanics. Step
// content is localized (see i18n/guideSteps).
export default function GuideModal({ open, onClose }) {
  const lang = useGameStore((st) => st.lang)
  const [step, setStep] = useState(0)
  if (!open) return null

  const STEPS = guideSteps(lang)
  const s = STEPS[step]
  const last = step === STEPS.length - 1

  const finish = () => {
    setStep(0)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-emerald-500/40 bg-slate-950 p-5 shadow-2xl">
        <div className="text-center text-4xl">{s.emoji}</div>
        <h2 className="mt-2 text-center text-lg font-bold text-emerald-300">
          {s.title}
        </h2>
        <p className="mt-2 min-h-[4.5rem] text-sm leading-relaxed text-slate-300">
          {s.body}
        </p>

        {/* step dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === step ? 'bg-emerald-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            onClick={finish}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            {t(lang, 'skip')}
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((n) => n - 1)}
                className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                {t(lang, 'back')}
              </button>
            )}
            <button
              onClick={() => (last ? finish() : setStep((n) => n + 1))}
              className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
            >
              {last ? t(lang, 'letsGo') : t(lang, 'next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
