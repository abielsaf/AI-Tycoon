import { useState } from 'react'

// New-player walkthrough. Content-only steps — no spotlight/anchoring library,
// just a concise stepped modal covering the core loop and mechanics.
const STEPS = [
  {
    emoji: '🧠',
    title: 'Welcome to AI Tycoon',
    body: 'You run a compute empire. Generate FLOPS (compute), which auto-sell for money. Reinvest in hardware to produce even more. Numbers go up.',
  },
  {
    emoji: '🖥️',
    title: 'Click for Compute',
    body: 'Click the big terminal to generate FLOPS by hand. Early on this funds your very first machine — after that, hardware does the heavy lifting.',
  },
  {
    emoji: '🏭',
    title: 'Buy Hardware',
    body: 'Hardware produces FLOPS automatically. Higher tiers are far more efficient per dollar. Use ×1 / ×10 / MAX to buy in bulk — and the Sell button to refund machines you no longer want.',
  },
  {
    emoji: '🌡️',
    title: 'Mind the Heat',
    body: 'Every machine makes heat. If total heat exceeds your cooling capacity, production gets throttled. Buy Cooling Units and cooling upgrades to stay in the green.',
  },
  {
    emoji: '⚡',
    title: 'Upgrades & Events',
    body: 'Upgrades are one-time boosts to clicks, production, cooling and revenue. Random market events temporarily buff or debuff you — watch the toast and the pill up top.',
  },
  {
    emoji: '🌌',
    title: 'Ascend',
    body: 'Once you generate enough lifetime compute, trigger a Singularity Reset. You lose your run but gain AI Insights to spend on the permanent Ascension Tree — and unlock skins.',
  },
]

export default function GuideModal({ open, onClose }) {
  const [step, setStep] = useState(0)
  if (!open) return null

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
            Skip
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((n) => n - 1)}
                className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Back
              </button>
            )}
            <button
              onClick={() => (last ? finish() : setStep((n) => n + 1))}
              className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
            >
              {last ? "Let's go" : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
