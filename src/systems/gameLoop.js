import { useGameStore } from '../store/gameStore'
import { saveGame } from './saveSystem'

const TICK_MS = 100
const SAVE_EVERY = 10_000 // autosave interval
const FLAVOR_EVERY = 25_000 // drop a flavor headline into the ticker

// Starts the passive game loop. Returns a stop() cleanup fn.
export function startGameLoop() {
  let last = performance.now()
  let lastSave = Date.now()
  let lastFlavor = Date.now()

  const tickId = setInterval(() => {
    const now = performance.now()
    const dt = Math.min(0.5, (now - last) / 1000) // clamp big gaps (tab throttle)
    last = now
    useGameStore.getState().tick(dt, Date.now() / 1000)

    const wall = Date.now()
    if (wall - lastSave >= SAVE_EVERY) {
      saveGame()
      lastSave = wall
    }
    if (wall - lastFlavor >= FLAVOR_EVERY) {
      useGameStore.getState().addFlavorNews()
      lastFlavor = wall
    }
  }, TICK_MS)

  const onLeave = () => saveGame()
  window.addEventListener('beforeunload', onLeave)

  return () => {
    clearInterval(tickId)
    window.removeEventListener('beforeunload', onLeave)
  }
}
