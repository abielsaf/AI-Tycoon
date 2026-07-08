import { useGameStore } from '../store/gameStore'
import { fmt, fmtMoney, fmtTime } from '../utils/format'

export default function OfflineModal() {
  const offline = useGameStore((s) => s.lastOffline)
  const clear = useGameStore((s) => s.clearOffline)
  if (!offline) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-xl border border-emerald-500/40 bg-slate-950 p-5 text-center shadow-2xl">
        <div className="text-4xl">🌙</div>
        <h2 className="mt-2 text-lg font-bold text-emerald-300">Welcome back!</h2>
        <p className="mt-1 text-xs text-slate-400">
          Your datacenter ran for{' '}
          <span className="mono text-emerald-300">{fmtTime(offline.seconds)}</span>{' '}
          while you were away (at 50% efficiency).
        </p>
        <div className="mono mt-4 space-y-1 text-sm">
          <div className="text-emerald-300">+{fmtMoney(offline.money)}</div>
          <div className="text-cyan-300">+{fmt(offline.compute)} FLOPS</div>
        </div>
        <button
          onClick={clear}
          className="mt-5 w-full rounded bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
        >
          Collect
        </button>
      </div>
    </div>
  )
}
