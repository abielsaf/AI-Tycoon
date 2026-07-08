// Tiny synthesized SFX — no audio assets. A short chime for good events, a
// lower buzz for bad ones. Muted state lives in localStorage so it survives
// reloads without touching the game save.
const MUTE_KEY = 'ai-tycoon-muted'

let ctx = null

export function isMuted() {
  return localStorage.getItem(MUTE_KEY) === '1'
}

export function setMuted(muted) {
  localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
}

function tone(freq, start, dur, gain = 0.12) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.value = freq
  o.connect(g)
  g.connect(ctx.destination)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  o.start(start)
  o.stop(start + dur)
}

// Play an event cue. `good` picks a rising two-note chime vs a single low buzz.
export function playEventSound(good) {
  if (isMuted()) return
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    const t = ctx.currentTime
    if (good) {
      tone(660, t, 0.18)
      tone(880, t + 0.12, 0.25)
    } else {
      tone(220, t, 0.3, 0.1)
    }
  } catch {
    // audio not available / blocked — silent, never break the game
  }
}
