// Market events fire every ~3-5 min. `mods` are temporary multipliers applied
// while active; `cash` is an instant one-time money grant (fraction of net worth
// handled in the store). Headlines feed the news ticker.
export const EVENTS = [
  {
    id: 'ram_spike',
    title: 'RAM Prices Spike',
    headline: '📈 DRAM shortage! Hardware costs +40% for 60s.',
    duration: 60,
    mods: { costMult: 1.4 },
  },
  {
    id: 'crypto_crash',
    title: 'Crypto Crash',
    headline: '💥 Crypto crashes — miners dump GPUs. Hardware -30% for 60s.',
    duration: 60,
    mods: { costMult: 0.7 },
  },
  {
    id: 'ai_hype',
    title: 'AI Hype Cycle',
    headline: '🚀 Everyone wants AI! Revenue +50% for 60s.',
    duration: 60,
    mods: { revenueMult: 1.5 },
  },
  {
    id: 'viral_model',
    title: 'Model Goes Viral',
    headline: '🔥 Your demo hits the front page! FLOPS x2 for 45s.',
    duration: 45,
    mods: { flopsMult: 2 },
  },
  {
    id: 'heatwave',
    title: 'Heatwave',
    headline: '🌡️ Record temperatures! Cooling -25% for 60s.',
    duration: 60,
    mods: { coolingMult: 0.75 },
  },
  {
    id: 'grid_strain',
    title: 'Power Grid Strain',
    headline: '⚡ Brownouts across the region. Production -30% for 45s.',
    duration: 45,
    mods: { flopsMult: 0.7 },
  },
  {
    id: 'vc_round',
    title: 'VC Funding Round',
    headline: '💰 A VC just wired you a war chest. Instant cash injection!',
    duration: 0,
    cash: 0.15, // grants 15% of current net worth-ish (see store)
  },
]

// Flavor headlines that scroll when no event is active.
export const FLAVOR_HEADLINES = [
  'BREAKING: Startup claims AGI is "18 months away", again.',
  'Analysts baffled as FLOPS keep going up.',
  'Local shoebox datacenter now valued at $4B.',
  'Report: 90% of AI is just matrix multiplication and vibes.',
  'GPU scalpers report record quarter.',
  'New benchmark dropped. Everyone is #1 on it.',
  'Cooling engineer wins award, immediately overheats.',
  'Investors ask what a "transformer" is, buy anyway.',
  'Datacenter hum now audible from space.',
  'Intern discovers you can just add more GPUs.',
]
