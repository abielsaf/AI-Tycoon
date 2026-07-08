import { create } from 'zustand'
import { BUILDINGS, BUILDING_MAP } from '../data/buildings'
import { UPGRADES, UPGRADE_MAP } from '../data/upgrades'
import { ACHIEVEMENTS } from '../data/achievements'
import { EVENTS, FLAVOR_HEADLINES } from '../data/events'
import { TREE, treeNodeCost } from '../data/tree'
import { SKIN_MAP } from '../data/skins'

export const SAVE_VERSION = 2
const START_MONEY = 20
const PRICE = 1 // money per FLOP sold
const BASE_COOLING = 25
const BASE_CLICK = 1
export const PRESTIGE_UNLOCK = 2.5e8 // lifetime FLOPS needed to reset
const OFFLINE_CAP = 8 * 3600 // max seconds of offline progress
const OFFLINE_EFFICIENCY = 0.5

// Money a fresh run starts with, boosted by the Seed Capital tree node (×8/lvl).
function runStartMoney(tree) {
  return START_MONEY * Math.pow(8, tree?.headstart || 0)
}
// Offline efficiency, boosted +8%/lvl by Cloud Sync, capped at 95%.
function offlineEff(tree) {
  return Math.min(0.95, OFFLINE_EFFICIENCY + (tree?.offline || 0) * 0.08)
}
const EVENT_MIN = 180 // seconds
const EVENT_MAX = 300

// ponytail: balance knobs above — tuned for ~1h to first Singularity Reset.

export function pendingInsights(lifetimeCompute) {
  if (lifetimeCompute < PRESTIGE_UNLOCK) return 0
  return Math.floor(10 * Math.sqrt(lifetimeCompute / 1e8))
}

// --- Pure derived stats. Depends only on `state` + current event mods. ---
export function getStats(state) {
  const ev = state.activeEvent?.mods || {}

  let clickPower = BASE_CLICK
  let clickMult = 1
  let heatMult = 1
  let coolingMult = 1
  let coolingFlat = 0
  let flopsMult = 1
  let revenueMult = 1
  const buildingMult = {}

  for (const id of state.upgrades) {
    const u = UPGRADE_MAP[id]
    if (!u) continue
    for (const e of u.effect) {
      switch (e.type) {
        case 'click_flat': clickPower += e.amount; break
        case 'click_mult': clickMult *= e.amount; break
        case 'heat_mult': heatMult *= e.amount; break
        case 'cooling_mult': coolingMult *= e.amount; break
        case 'cooling_flat': coolingFlat += e.amount; break
        case 'flops_mult': flopsMult *= e.amount; break
        case 'revenue_mult': revenueMult *= e.amount; break
        case 'building_mult':
          buildingMult[e.target] = (buildingMult[e.target] || 1) * e.amount
          break
        default: break
      }
    }
  }

  // Ascension tree: permanent, spent Insights. Mult effects compound per level.
  let costDiscount = 1
  for (const n of TREE) {
    const lvl = state.tree?.[n.id] || 0
    if (!lvl) continue
    for (const e of n.effect) {
      switch (e.type) {
        case 'click_mult': clickMult *= Math.pow(e.amount, lvl); break
        case 'flops_mult': flopsMult *= Math.pow(e.amount, lvl); break
        case 'cooling_mult': coolingMult *= Math.pow(e.amount, lvl); break
        case 'revenue_mult': revenueMult *= Math.pow(e.amount, lvl); break
        case 'cost_discount': costDiscount *= Math.pow(e.amount, lvl); break
        default: break // start_money / offline_add handled outside getStats
      }
    }
  }

  let rawFlops = 0
  let heat = 0
  let cooling = BASE_COOLING + coolingFlat
  for (const b of BUILDINGS) {
    const count = state.buildings[b.id] || 0
    if (!count) continue
    rawFlops += count * b.flops * (buildingMult[b.id] || 1)
    heat += count * b.heat
    cooling += count * b.cooling
  }

  heat *= heatMult
  cooling *= coolingMult * (ev.coolingMult || 1)

  const heatPenalty = heat > cooling && heat > 0 ? cooling / heat : 1

  const flopsPerSec =
    rawFlops * flopsMult * heatPenalty * (ev.flopsMult || 1)
  const revenue = revenueMult * (ev.revenueMult || 1)
  const moneyPerSec = flopsPerSec * PRICE * revenue
  const finalClick = clickPower * clickMult

  return {
    clickPower: finalClick,
    flopsPerSec,
    moneyPerSec,
    heat,
    cooling,
    heatPenalty,
    revenue,
    costMult: (ev.costMult || 1) * costDiscount,
  }
}

export function buildingCost(id, owned, costMult = 1) {
  const b = BUILDING_MAP[id]
  return Math.ceil(b.baseCost * Math.pow(b.costMult, owned) * costMult)
}

// Total cost to buy `count` of a building starting from `owned`.
// Sums per-unit (matches how buyBuilding charges) so the price is exact.
export function bulkCost(id, owned, count, costMult = 1) {
  let total = 0
  for (let k = 0; k < count; k++) total += buildingCost(id, owned + k, costMult)
  return total
}

const SELL_REFUND = 0.5 // fraction of base (event-free) price refunded on sale

// Refund for selling the top `count` units (the most expensive ones owned).
// Uses costMult=1 so market events never change what a sale is worth.
export function sellValue(id, owned, count) {
  let total = 0
  for (let k = 0; k < count; k++) total += buildingCost(id, owned - 1 - k, 1)
  return Math.floor(total * SELL_REFUND)
}

// How many of a building `money` can buy, and what it costs. Count is
// logarithmically bounded, so this loop stays small.
export function maxAffordable(id, owned, money, costMult = 1) {
  let count = 0
  let cost = 0
  while (count < 100000) {
    const next = buildingCost(id, owned + count, costMult)
    if (cost + next > money) break
    cost += next
    count++
  }
  return { count, cost }
}

export function upgradeReqMet(u, s) {
  if (!u.req) return true
  const r = u.req
  if (r.building) return (s.buildings[r.building] || 0) >= r.count
  if (r.clicks) return s.clicks >= r.clicks
  if (r.money) return s.allTimeCompute >= r.money
  return true
}

function freshRun(tree) {
  return {
    money: runStartMoney(tree),
    buildings: {},
    upgrades: [],
    lifetimeCompute: 0,
    activeEvent: null,
    nextEventAt: Date.now() / 1000 + rand(EVENT_MIN, EVENT_MAX),
  }
}

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function pushNews(news, text) {
  const next = [{ t: Date.now(), text }, ...news]
  return next.slice(0, 12)
}

const initialState = {
  saveVersion: SAVE_VERSION,
  ...freshRun(),
  // persistent-across-prestige:
  insights: 0,
  tree: {}, // { nodeId: level } — ascension tree
  skin: 'matrix',
  unlockedSkins: ['matrix'],
  resets: 0,
  clicks: 0,
  allTimeCompute: 0,
  achievements: [],
  playtime: 0,
  // meta:
  buyMode: 1, // 1 | 10 | 'max' — UI only, not persisted
  lastSave: Date.now(),
  news: [],
  stats: null,
  lastOffline: null, // {seconds, money, compute} shown once on load
  eventFlash: null, // {title, headline, good, n} — drives the toast + sound
}

function checkAchievements(state, stats) {
  const unlocked = []
  let news = state.news
  for (const a of ACHIEVEMENTS) {
    if (state.achievements.includes(a.id)) continue
    if (a.check(state, stats)) {
      unlocked.push(a.id)
      news = pushNews(news, `🏆 Achievement unlocked: ${a.name}`)
    }
  }
  if (!unlocked.length) return null
  return { achievements: [...state.achievements, ...unlocked], news }
}

export const useGameStore = create((set) => ({
  ...initialState,

  recomputeStats: () => set((s) => ({ stats: getStats(s) })),

  click: () =>
    set((s) => {
      const stats = s.stats || getStats(s)
      const gain = stats.clickPower
      const next = {
        clicks: s.clicks + 1,
        money: s.money + gain * PRICE * stats.revenue,
        lifetimeCompute: s.lifetimeCompute + gain,
        allTimeCompute: s.allTimeCompute + gain,
      }
      const merged = { ...s, ...next }
      const ach = checkAchievements(merged, stats)
      return ach ? { ...next, ...ach } : next
    }),

  buyBuilding: (id, count = 1) =>
    set((s) => {
      if (count < 1) return {}
      const owned = s.buildings[id] || 0
      const cost = bulkCost(id, owned, count, s.stats?.costMult || 1)
      if (s.money < cost) return {}
      const buildings = { ...s.buildings, [id]: owned + count }
      const merged = { ...s, money: s.money - cost, buildings }
      const stats = getStats(merged)
      const base = { money: merged.money, buildings, stats }
      const ach = checkAchievements({ ...merged, stats }, stats)
      return ach ? { ...base, ...ach } : base
    }),

  sellBuilding: (id, count = 1) =>
    set((s) => {
      const owned = s.buildings[id] || 0
      const n = Math.min(count, owned)
      if (n < 1) return {}
      const refund = sellValue(id, owned, n)
      const buildings = { ...s.buildings, [id]: owned - n }
      const merged = { ...s, money: s.money + refund, buildings }
      const stats = getStats(merged)
      return { money: merged.money, buildings, stats }
    }),

  setBuyMode: (mode) => set({ buyMode: mode }),

  buyTreeNode: (id) =>
    set((s) => {
      const node = TREE.find((n) => n.id === id)
      if (!node) return {}
      const level = s.tree[id] || 0
      if (level >= node.maxLevel) return {}
      const cost = treeNodeCost(node, level)
      if (s.insights < cost) return {}
      const tree = { ...s.tree, [id]: level + 1 }
      const merged = { ...s, insights: s.insights - cost, tree }
      return { insights: merged.insights, tree, stats: getStats(merged) }
    }),

  unlockSkin: (id) =>
    set((s) => {
      const skin = SKIN_MAP[id]
      if (!skin || s.unlockedSkins.includes(id) || s.insights < skin.cost) return {}
      return {
        insights: s.insights - skin.cost,
        unlockedSkins: [...s.unlockedSkins, id],
        skin: id, // equip on unlock
      }
    }),

  setSkin: (id) =>
    set((s) => (s.unlockedSkins.includes(id) ? { skin: id } : {})),

  buyUpgrade: (id) =>
    set((s) => {
      if (s.upgrades.includes(id)) return {}
      const u = UPGRADE_MAP[id]
      if (!u || s.money < u.cost) return {}
      const upgrades = [...s.upgrades, id]
      const merged = { ...s, money: s.money - u.cost, upgrades }
      const stats = getStats(merged)
      return {
        money: merged.money,
        upgrades,
        stats,
        news: pushNews(s.news, `✅ Purchased: ${u.name}`),
      }
    }),

  buyAllUpgrades: () =>
    set((s) => {
      const ownedSet = new Set(s.upgrades)
      // cheapest first so the money buys as many as possible
      const candidates = UPGRADES.filter(
        (u) => !ownedSet.has(u.id) && upgradeReqMet(u, s)
      ).sort((a, b) => a.cost - b.cost)

      let money = s.money
      const bought = []
      for (const u of candidates) {
        if (money < u.cost) continue
        money -= u.cost
        bought.push(u)
        ownedSet.add(u.id)
      }
      if (!bought.length) return {}

      const upgrades = [...ownedSet]
      const merged = { ...s, money, upgrades }
      const stats = getStats(merged)
      const label =
        bought.length === 1
          ? `✅ Purchased: ${bought[0].name}`
          : `✅ Purchased ${bought.length} upgrades`
      return { money, upgrades, stats, news: pushNews(s.news, label) }
    }),

  tick: (dt, nowSec) =>
    set((s) => {
      const patch = {}
      let state = s

      // event expiry
      if (state.activeEvent && nowSec > state.activeEvent.endsAt) {
        state = { ...state, activeEvent: null }
        patch.activeEvent = null
      }

      // recompute stats each tick (cheap; events/time may have changed things)
      const stats = getStats(state)
      patch.stats = stats

      const produced = stats.flopsPerSec * dt
      patch.money = state.money + stats.moneyPerSec * dt
      patch.lifetimeCompute = state.lifetimeCompute + produced
      patch.allTimeCompute = state.allTimeCompute + produced
      patch.playtime = state.playtime + dt

      // event scheduling
      if (nowSec >= state.nextEventAt) {
        const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)]
        patch.nextEventAt = nowSec + rand(EVENT_MIN, EVENT_MAX)
        let news = state.news
        if (ev.cash) {
          const grant = Math.max(500, state.money * 0.1 + stats.moneyPerSec * 60)
          patch.money += grant
          news = pushNews(news, ev.headline)
        } else {
          patch.activeEvent = {
            id: ev.id,
            title: ev.title,
            headline: ev.headline,
            endsAt: nowSec + ev.duration,
            mods: ev.mods,
          }
          news = pushNews(news, ev.headline)
        }
        patch.news = news
        // bump `n` so the toast/sound retrigger even on a repeated event
        patch.eventFlash = {
          title: ev.title,
          headline: ev.headline,
          good: !!ev.good,
          n: (state.eventFlash?.n || 0) + 1,
        }
      }

      const merged = { ...state, ...patch }
      const ach = checkAchievements(merged, stats)
      if (ach) Object.assign(patch, ach)
      return patch
    }),

  prestige: () =>
    set((s) => {
      const gain = pendingInsights(s.lifetimeCompute)
      if (gain < 1) return {}
      const run = freshRun(s.tree)
      const merged = {
        ...s,
        ...run,
        insights: s.insights + gain,
        resets: s.resets + 1,
        news: pushNews(s.news, `🌌 Singularity Reset! +${gain} AI Insights.`),
      }
      const stats = getStats(merged)
      const base = { ...run, insights: merged.insights, resets: merged.resets, stats, news: merged.news }
      const ach = checkAchievements({ ...merged, stats }, stats)
      return ach ? { ...base, ...ach } : base
    }),

  addFlavorNews: () =>
    set((s) => ({
      news: pushNews(
        s.news,
        FLAVOR_HEADLINES[Math.floor(Math.random() * FLAVOR_HEADLINES.length)]
      ),
    })),

  // --- save / load ---
  loadState: (data) =>
    set(() => {
      const merged = { ...initialState, ...data }
      // recompute offline progress
      const now = Date.now()
      const elapsed = Math.min(OFFLINE_CAP, Math.max(0, (now - (data.lastSave || now)) / 1000))
      merged.nextEventAt = now / 1000 + rand(EVENT_MIN, EVENT_MAX)
      merged.activeEvent = null
      const stats = getStats(merged)
      let lastOffline = null
      if (elapsed > 30 && stats.moneyPerSec > 0) {
        const eff = offlineEff(merged.tree)
        const money = stats.moneyPerSec * elapsed * eff
        const compute = stats.flopsPerSec * elapsed * eff
        merged.money += money
        merged.lifetimeCompute += compute
        merged.allTimeCompute += compute
        lastOffline = { seconds: elapsed, money, compute }
      }
      merged.stats = stats
      merged.lastOffline = lastOffline
      merged.lastSave = now
      return merged
    }),

  clearOffline: () => set({ lastOffline: null }),

  hardReset: () =>
    set(() => {
      const fresh = { ...initialState, ...freshRun({}), lastSave: Date.now() }
      fresh.stats = getStats(fresh)
      return fresh
    }),

  markSaved: () => set({ lastSave: Date.now() }),
}))
