import { useState } from 'react'
import { useGameStore, pendingInsights, PRESTIGE_UNLOCK } from '../store/gameStore'
import { TREE, treeNodeCost } from '../data/tree'
import { SKINS } from '../data/skins'
import { fmt } from '../utils/format'

function ResetSection() {
  const lifetime = useGameStore((s) => s.lifetimeCompute)
  const prestige = useGameStore((s) => s.prestige)
  const [confirming, setConfirming] = useState(false)

  const pending = pendingInsights(lifetime)
  const unlocked = pending >= 1

  return (
    <>
      <p className="mt-1 text-[11px] leading-snug text-slate-400">
        Reset all hardware, upgrades and money for permanent{' '}
        <span className="text-fuchsia-300">AI Insights</span> to spend below.
      </p>
      {unlocked ? (
        <>
          <div className="mono mt-2 text-sm text-fuchsia-200">
            Reset now for <span className="font-bold">+{fmt(pending)}</span>{' '}
            Insights
          </div>
          {confirming ? (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  prestige()
                  setConfirming(false)
                }}
                className="flex-1 rounded bg-fuchsia-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-fuchsia-500"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="pulse-glow mt-2 w-full rounded bg-fuchsia-600/90 px-3 py-1.5 text-xs font-bold text-white hover:bg-fuchsia-500"
            >
              Trigger Singularity
            </button>
          )}
        </>
      ) : (
        <div className="mono mt-2 text-[11px] text-slate-500">
          Unlocks at {fmt(PRESTIGE_UNLOCK)} lifetime FLOPS ({fmt(lifetime)} so
          far)
        </div>
      )}
    </>
  )
}

function TreeNode({ node }) {
  const level = useGameStore((s) => s.tree[node.id] || 0)
  const insights = useGameStore((s) => s.insights)
  const buy = useGameStore((s) => s.buyTreeNode)

  const maxed = level >= node.maxLevel
  const cost = maxed ? 0 : treeNodeCost(node, level)
  const affordable = !maxed && insights >= cost

  return (
    <button
      onClick={() => affordable && buy(node.id)}
      disabled={!affordable}
      title={node.desc}
      className={`flex flex-col items-start gap-0.5 rounded border px-2 py-1.5 text-left transition ${
        maxed
          ? 'border-fuchsia-400/40 bg-fuchsia-900/20'
          : affordable
            ? 'border-fuchsia-500/40 bg-fuchsia-950/30 hover:border-fuchsia-400/70 hover:bg-fuchsia-900/30'
            : 'cursor-not-allowed border-slate-700/40 bg-slate-900/30 opacity-60'
      }`}
    >
      <div className="flex w-full items-center justify-between gap-1">
        <span className="truncate text-xs font-semibold text-slate-100">
          {node.icon} {node.name}
        </span>
        <span className="mono text-[10px] text-fuchsia-300/70">
          {level}/{node.maxLevel}
        </span>
      </div>
      <span className="text-[10px] leading-tight text-slate-400">{node.desc}</span>
      <span
        className={`mono text-[10px] font-bold ${
          maxed ? 'text-fuchsia-300' : affordable ? 'text-fuchsia-200' : 'text-slate-500'
        }`}
      >
        {maxed ? 'MAXED' : `${fmt(cost)} 🧿`}
      </span>
    </button>
  )
}

function SkinPicker() {
  const skin = useGameStore((s) => s.skin)
  const unlocked = useGameStore((s) => s.unlockedSkins)
  const insights = useGameStore((s) => s.insights)
  const unlockSkin = useGameStore((s) => s.unlockSkin)
  const setSkin = useGameStore((s) => s.setSkin)

  return (
    <div className="mt-3 border-t border-fuchsia-500/20 pt-2">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-500/70">
        Skins
      </h3>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {SKINS.map((sk) => {
          const owned = unlocked.includes(sk.id)
          const equipped = skin === sk.id
          const affordable = insights >= sk.cost
          return (
            <button
              key={sk.id}
              title={owned ? sk.desc : `${sk.desc} — ${sk.cost} Insights`}
              onClick={() => (owned ? setSkin(sk.id) : affordable && unlockSkin(sk.id))}
              disabled={!owned && !affordable}
              className={`rounded border px-2 py-1 text-[10px] font-semibold transition ${
                equipped
                  ? 'border-fuchsia-400 bg-fuchsia-500/30 text-fuchsia-100'
                  : owned
                    ? 'border-fuchsia-500/30 text-fuchsia-300/80 hover:border-fuchsia-400/60'
                    : affordable
                      ? 'border-slate-600 text-slate-300 hover:border-fuchsia-400/60'
                      : 'cursor-not-allowed border-slate-700/40 text-slate-500 opacity-60'
              }`}
            >
              {sk.name}
              {!owned && <span className="mono ml-1 text-fuchsia-400/70">{sk.cost}🧿</span>}
              {equipped && ' ✓'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function PrestigePanel() {
  const insights = useGameStore((s) => s.insights)
  const resets = useGameStore((s) => s.resets)
  const ascended = resets > 0 || insights > 0

  return (
    <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/20 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
          🌌 Singularity
        </h2>
        <span className="mono text-xs text-fuchsia-300/70">
          {fmt(insights)} 🧿 Insights
        </span>
      </div>

      <ResetSection />

      {ascended && (
        <>
          <div className="mt-3 border-t border-fuchsia-500/20 pt-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-500/70">
              Ascension Tree
            </h3>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {TREE.map((node) => (
                <TreeNode key={node.id} node={node} />
              ))}
            </div>
          </div>
          <SkinPicker />
        </>
      )}
    </div>
  )
}
