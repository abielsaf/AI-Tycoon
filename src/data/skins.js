// Cosmetic skins bought once with AI Insights. A skin is just a CSS filter
// applied to the whole app root — near-zero code, recolors every neon accent,
// the grid backdrop and the buttons at once. 'matrix' is the free default.
export const SKINS = [
  { id: 'matrix', name: 'Matrix', desc: 'The classic terminal green.', cost: 0, filter: 'none' },
  { id: 'synthwave', name: 'Synthwave', desc: 'Neon magenta and violet.', cost: 4, filter: 'hue-rotate(255deg) saturate(1.25)' },
  { id: 'inferno', name: 'Inferno', desc: 'Molten orange and red.', cost: 4, filter: 'hue-rotate(300deg) saturate(1.35)' },
  { id: 'arctic', name: 'Arctic', desc: 'Cold electric blue.', cost: 6, filter: 'hue-rotate(150deg) saturate(1.1)' },
  { id: 'midas', name: 'Midas', desc: 'Everything turns to gold.', cost: 10, filter: 'hue-rotate(65deg) saturate(1.4) brightness(1.05)' },
]

export const SKIN_MAP = Object.fromEntries(SKINS.map((s) => [s.id, s]))
