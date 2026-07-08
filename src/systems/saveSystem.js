import { useGameStore, SAVE_VERSION } from '../store/gameStore'

const KEY = 'ai-tycoon-save'

// Only persist real progress — derived/transient fields are recomputed on load.
const PERSIST_FIELDS = [
  'saveVersion',
  'money',
  'buildings',
  'upgrades',
  'lifetimeCompute',
  'insights',
  'tree',
  'skin',
  'unlockedSkins',
  'lang',
  'resets',
  'clicks',
  'allTimeCompute',
  'achievements',
  'playtime',
  'lastSave',
]

function snapshot() {
  const s = useGameStore.getState()
  const out = {}
  for (const f of PERSIST_FIELDS) out[f] = s[f]
  out.saveVersion = SAVE_VERSION
  out.lastSave = Date.now()
  return out
}

export function saveGame() {
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot()))
    useGameStore.getState().markSaved()
    return true
  } catch (e) {
    console.error('Save failed', e)
    return false
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return false
    const data = migrate(JSON.parse(raw))
    useGameStore.getState().loadState(data)
    return true
  } catch (e) {
    console.error('Load failed', e)
    return false
  }
}

// Future save migrations key off saveVersion.
function migrate(data) {
  if (!data.saveVersion) data.saveVersion = 1
  // v1 -> v2: Insights went from a passive +2%/each bonus to a spendable
  // ascension-tree currency. Existing Insights carry over as the new balance;
  // seed the new fields so old saves load cleanly.
  if (data.saveVersion < 2) {
    data.tree = data.tree || {}
    data.skin = data.skin || 'matrix'
    data.unlockedSkins = data.unlockedSkins || ['matrix']
    data.saveVersion = 2
  }
  return data
}

export function wipeSave() {
  localStorage.removeItem(KEY)
}

// --- Export / Import as Base64 text ---
export function exportSave() {
  const json = JSON.stringify(snapshot())
  const b64 = btoa(unescape(encodeURIComponent(json)))
  const blob = new Blob([b64], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ai-tycoon-save.txt'
  a.click()
  URL.revokeObjectURL(url)
}

export function importSave(text) {
  try {
    const json = decodeURIComponent(escape(atob(text.trim())))
    const data = JSON.parse(json)
    if (typeof data.money !== 'number' || typeof data.buildings !== 'object') {
      throw new Error('Invalid save format')
    }
    useGameStore.getState().loadState(migrate(data))
    saveGame()
    return true
  } catch (e) {
    console.error('Import failed', e)
    return false
  }
}
