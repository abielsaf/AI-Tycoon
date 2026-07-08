// Buildings: bought with Money. Produce FLOPS/s (auto-sold to Money) and Heat.
// Cooling Unit produces no FLOPS but adds cooling capacity.
// Design rule: FLOPS-per-dollar ROUGHLY DOUBLES each tier, so climbing tiers
// accelerates income (the exponential engine). Cost scales 1.15x per unit owned.
// ponytail: these numbers are the balance knobs — tuned for ~1h to first reset.
export const BUILDINGS = [
  {
    id: 'pi',
    name: 'Raspberry Pi',
    desc: 'A tiny SBC crunching numbers in a shoebox.',
    baseCost: 15,
    costMult: 1.15,
    flops: 0.3,
    heat: 1,
    cooling: 0,
  },
  {
    id: 'office_pc',
    name: 'Used Office PC',
    desc: 'Refurbished corporate cast-offs. Reliable enough.',
    baseCost: 130,
    costMult: 1.15,
    flops: 5,
    heat: 3,
    cooling: 0,
  },
  {
    id: 'gaming_rig',
    name: 'Gaming Rig',
    desc: 'RGB everything. Surprisingly good at matrix math.',
    baseCost: 1_200,
    costMult: 1.15,
    flops: 90,
    heat: 18,
    cooling: 0,
  },
  {
    id: 'cooling_unit',
    name: 'Cooling Unit',
    desc: 'Industrial AC. No compute, just sweet, sweet cold air.',
    baseCost: 500,
    costMult: 1.10,
    flops: 0,
    heat: 0,
    cooling: 150,
  },
  {
    id: 'server_rack',
    name: 'Server Rack',
    desc: 'A wall of blade servers screaming for airflow.',
    baseCost: 12_000,
    costMult: 1.15,
    flops: 1_900,
    heat: 500,
    cooling: 0,
  },
  {
    id: 'gpu_cluster',
    name: 'GPU Cluster',
    desc: 'Racks of accelerators. The real money printer.',
    baseCost: 130_000,
    costMult: 1.15,
    flops: 40_000,
    heat: 12_000,
    cooling: 0,
  },
  {
    id: 'datacenter_wing',
    name: 'Data Center Wing',
    desc: 'A whole hall of hardware. You have arrived.',
    baseCost: 1_500_000,
    costMult: 1.15,
    flops: 950_000,
    heat: 260_000,
    cooling: 0,
  },
  {
    id: 'quantum',
    name: 'Quantum Prototype',
    desc: 'Superposition go brrr. Runs near absolute zero.',
    baseCost: 20_000_000,
    costMult: 1.16,
    flops: 25_000_000,
    heat: 6_000_000,
    cooling: 0,
  },
]

export const BUILDING_MAP = Object.fromEntries(BUILDINGS.map((b) => [b.id, b]))
