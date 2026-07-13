import { useState } from 'react'
import { useGameStore, upgradeReqMet } from '../store/gameStore'
import { UPGRADES, UPGRADE_MAP } from '../data/upgrades'
import { fmtMoney } from '../utils/format'
import { t, tc } from '../i18n'

export default function UpgradePanel() {
  const owned = useGameStore((s) => s.upgrades)
  const money = useGameStore((s) => s.money)
  const buy = useGameStore((s) => s.buyUpgrade)
  const buyAll = useGameStore((s) => s.buyAllUpgrades)
  const lang = useGameStore((s) => s.lang)
  const state = useGameStore()
  const [showOwned, setShowOwned] = useState(false)

  const available = UPGRADES.filter(
    (u) => !owned.includes(u.id) && upgradeReqMet(u, state)
  ).sort((a, b) => a.cost - b.cost)

  const affordableCount = available.filter((u) => money >= u.cost).length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-fuchsia-500/70">
          {t(lang, 'upgrades')}{' '}
          <button
            onClick={() => setShowOwned((v) => !v)}
            disabled={owned.length === 0}
            className={`normal-case tracking-normal ${owned.length ? 'text-slate-500 hover:text-fuchsia-400' : 'text-slate-600'}`}
          >
            {t(lang, 'ownedN', { n: owned.length })} {owned.length > 0 && (showOwned ? '▾' : '▸')}
          </button>
        </h2>
        <button
          onClick={buyAll}
          disabled={affordableCount === 0}
          className={`mono rounded px-2 py-0.5 text-[11px] font-bold transition ${
            affordableCount > 0
              ? 'bg-fuchsia-500/80 text-black hover:bg-fuchsia-400'
              : 'cursor-not-allowed border border-fuchsia-500/20 text-slate-600'
          }`}
        >
          {t(lang, 'buyAll')}{affordableCount > 0 ? ` (${affordableCount})` : ''}
        </button>
      </div>
      {showOwned && owned.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg border border-fuchsia-500/20 bg-fuchsia-950/10 p-1.5">
          {owned
            .map((id) => UPGRADE_MAP[id])
            .filter(Boolean)
            .map((u) => (
              <div key={u.id} className="px-1.5 py-0.5">
                <div className="text-[12px] font-semibold text-fuchsia-200/90">
                  ✓ {tc(lang, 'upgrades', u.id, 'name', u.name)}
                </div>
                <div className="text-[11px] text-slate-400">
                  {tc(lang, 'upgrades', u.id, 'desc', u.desc)}
                </div>
              </div>
            ))}
        </div>
      )}
      {available.length === 0 && (
        <p className="px-1 text-[11px] text-slate-500">
          {t(lang, 'noUpgrades')}
        </p>
      )}
      {available.map((u) => {
        const affordable = money >= u.cost
        return (
          <button
            key={u.id}
            onClick={() => buy(u.id)}
            disabled={!affordable}
            className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
              affordable
                ? 'border-fuchsia-500/30 bg-fuchsia-950/20 hover:border-fuchsia-400/60 hover:bg-fuchsia-900/25'
                : 'cursor-not-allowed border-slate-700/40 bg-slate-900/30 opacity-60'
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-slate-100">
                {tc(lang, 'upgrades', u.id, 'name', u.name)}
              </div>
              <div className="truncate text-[11px] text-slate-400">
                {tc(lang, 'upgrades', u.id, 'desc', u.desc)}
              </div>
            </div>
            <div
              className={`mono shrink-0 text-sm font-bold ${affordable ? 'text-fuchsia-300' : 'text-slate-500'}`}
            >
              {fmtMoney(u.cost)}
            </div>
          </button>
        )
      })}
    </div>
  )
}
