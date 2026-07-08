// Ascension tree: nodes bought with AI Insights (the prestige currency).
// Levels are permanent — they survive Singularity Resets. Effects reuse the
// same effect-type vocabulary as upgrades; getStats() applies them per level
// (mult types as amount^level, discount as amount^level). A few effect types
// are handled outside getStats (start_money, offline_add) — see gameStore.
export const TREE = [
  {
    id: 'overmind',
    name: 'Overmind',
    icon: '🧠',
    desc: 'All FLOPS ×1.25 per level.',
    baseCost: 1,
    costMult: 1.6,
    maxLevel: 12,
    effect: [{ type: 'flops_mult', amount: 1.25 }],
  },
  {
    id: 'deft',
    name: 'Deft Hands',
    icon: '🖱️',
    desc: 'Click power ×2 per level.',
    baseCost: 1,
    costMult: 2,
    maxLevel: 6,
    effect: [{ type: 'click_mult', amount: 2 }],
  },
  {
    id: 'cryo',
    name: 'Cryo Mastery',
    icon: '❄️',
    desc: 'Cooling capacity ×1.5 per level.',
    baseCost: 1,
    costMult: 1.7,
    maxLevel: 6,
    effect: [{ type: 'cooling_mult', amount: 1.5 }],
  },
  {
    id: 'market',
    name: 'Market Maker',
    icon: '💹',
    desc: 'Revenue ×1.3 per level.',
    baseCost: 2,
    costMult: 1.6,
    maxLevel: 8,
    effect: [{ type: 'revenue_mult', amount: 1.3 }],
  },
  {
    id: 'discount',
    name: 'Bulk Deals',
    icon: '🏷️',
    desc: 'Hardware 6% cheaper per level.',
    baseCost: 2,
    costMult: 1.8,
    maxLevel: 8,
    effect: [{ type: 'cost_discount', amount: 0.94 }],
  },
  {
    id: 'headstart',
    name: 'Seed Capital',
    icon: '💵',
    desc: 'Start each run with ×8 more cash per level.',
    baseCost: 1,
    costMult: 2.2,
    maxLevel: 6,
    effect: [{ type: 'start_money', amount: 8 }], // handled in freshRun
  },
  {
    id: 'offline',
    name: 'Cloud Sync',
    icon: '☁️',
    desc: '+8% offline efficiency per level.',
    baseCost: 2,
    costMult: 1.9,
    maxLevel: 6,
    effect: [{ type: 'offline_add', amount: 0.08 }], // handled in loadState
  },
]

export const TREE_MAP = Object.fromEntries(TREE.map((n) => [n.id, n]))

// Insight cost to buy the NEXT level (the one after `level` already owned).
export function treeNodeCost(node, level) {
  return Math.ceil(node.baseCost * Math.pow(node.costMult, level))
}
