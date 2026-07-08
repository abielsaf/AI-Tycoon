const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']

// Compact number formatting: 1234 -> "1.23K", 1e15 -> scientific fallback.
export function fmt(n, decimals = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '0'
  if (!Number.isFinite(n)) return '∞'
  const neg = n < 0
  n = Math.abs(n)
  if (n < 1000) {
    const d = n < 1 && n > 0 ? 2 : n < 100 ? 1 : 0
    return (neg ? '-' : '') + n.toFixed(n % 1 === 0 ? 0 : d)
  }
  const tier = Math.floor(Math.log10(n) / 3)
  if (tier < SUFFIXES.length) {
    const scaled = n / Math.pow(10, tier * 3)
    return (neg ? '-' : '') + scaled.toFixed(decimals) + SUFFIXES[tier]
  }
  return (neg ? '-' : '') + n.toExponential(2)
}

export function fmtMoney(n) {
  return '$' + fmt(n)
}

export function fmtTime(sec) {
  sec = Math.floor(sec)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
