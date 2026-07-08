// Upgrades: one-time purchases. `effect` is interpreted by getStats() in gameStore.
// types:
//  click_flat   +amount to click power
//  click_mult   click power *= amount
//  building_mult building[target].flops *= amount
//  flops_mult   all FLOPS production *= amount
//  heat_mult    all heat output *= amount (undervolting etc.)
//  cooling_mult cooling capacity *= amount
//  cooling_flat +amount passive cooling
//  revenue_mult money-per-FLOPS *= amount
// `req` (optional) gates visibility: { building: id, count } or { money }.
export const UPGRADES = [
  // --- Clicking ---
  {
    id: 'oc1',
    name: 'Overclocking I',
    desc: 'Push the clocks. +5 click power, but runs hotter.',
    cost: 200,
    effect: [{ type: 'click_flat', amount: 5 }, { type: 'heat_mult', amount: 1.05 }],
    req: { clicks: 15 },
  },
  {
    id: 'oc2',
    name: 'Overclocking II',
    desc: 'Delid and repaste. Click power x3.',
    cost: 5_000,
    effect: [{ type: 'click_mult', amount: 3 }, { type: 'heat_mult', amount: 1.05 }],
    req: { building: 'gaming_rig', count: 1 },
  },
  {
    id: 'ergo_mouse',
    name: 'Ergonomic Mouse',
    desc: 'Carpal tunnel is not a growth strategy. Click power x2.',
    cost: 800,
    effect: [{ type: 'click_mult', amount: 2 }],
    req: { clicks: 50 },
  },
  {
    id: 'macro_script',
    name: 'Macro Script',
    desc: 'Definitely not cheating. +50 click power.',
    cost: 40_000,
    effect: [{ type: 'click_flat', amount: 50 }],
    req: { building: 'server_rack', count: 1 },
  },

  // --- Cooling ---
  {
    id: 'undervolt',
    name: 'Undervolting',
    desc: 'Less voltage, less heat. All heat output -15%.',
    cost: 2_500,
    effect: [{ type: 'heat_mult', amount: 0.85 }],
    req: { building: 'office_pc', count: 3 },
  },
  {
    id: 'liquid_cooling',
    name: 'Liquid Cooling',
    desc: 'Water loops everywhere. Cooling capacity x1.5.',
    cost: 25_000,
    effect: [{ type: 'cooling_mult', amount: 1.5 }],
    req: { building: 'cooling_unit', count: 2 },
  },
  {
    id: 'immersion_cooling',
    name: 'Immersion Cooling',
    desc: 'Dunk the servers in mineral oil. Cooling capacity x2.',
    cost: 400_000,
    effect: [{ type: 'cooling_mult', amount: 2 }],
    req: { building: 'gpu_cluster', count: 3 },
  },
  {
    id: 'iceland',
    name: 'Move to Iceland',
    desc: 'Free arctic air and cheap geothermal. +5,000,000 cooling.',
    cost: 8_000_000,
    effect: [{ type: 'cooling_flat', amount: 5_000_000 }],
    req: { building: 'datacenter_wing', count: 2 },
  },

  // --- Building multipliers ---
  {
    id: 'gpu_drivers',
    name: 'Optimized Drivers',
    desc: 'Stop shipping day-one bugs. GPU Clusters x2.',
    cost: 300_000,
    effect: [{ type: 'building_mult', target: 'gpu_cluster', amount: 2 }],
    req: { building: 'gpu_cluster', count: 1 },
  },
  {
    id: 'cuda_opt',
    name: 'CUDA Optimization',
    desc: 'Hand-tuned kernels. GPU Clusters x2 again.',
    cost: 2_000_000,
    effect: [{ type: 'building_mult', target: 'gpu_cluster', amount: 2 }],
    req: { building: 'gpu_cluster', count: 10 },
  },
  {
    id: 'rack_density',
    name: 'High-Density Racks',
    desc: 'Cram more blades per U. Server Racks x2.',
    cost: 120_000,
    effect: [{ type: 'building_mult', target: 'server_rack', amount: 2 }],
    req: { building: 'server_rack', count: 5 },
  },
  {
    id: 'overhaul_pis',
    name: 'Pi Cluster Firmware',
    desc: 'Custom kernel for the Pi swarm. Raspberry Pis x3.',
    cost: 5_000,
    effect: [{ type: 'building_mult', target: 'pi', amount: 3 }],
    req: { building: 'pi', count: 10 },
  },

  // --- Global / revenue ---
  {
    id: 'batch_jobs',
    name: 'Batch Scheduling',
    desc: 'Keep the silicon busy 24/7. All FLOPS +25%.',
    cost: 60_000,
    effect: [{ type: 'flops_mult', amount: 1.25 }],
    req: { building: 'server_rack', count: 3 },
  },
  {
    id: 'train_llm',
    name: 'Train Your Own LLM',
    desc: 'Sell inference instead of raw compute. Revenue x1.5.',
    cost: 250_000,
    effect: [{ type: 'revenue_mult', amount: 1.5 }],
    req: { building: 'gpu_cluster', count: 2 },
  },
  {
    id: 'enterprise_sales',
    name: 'Enterprise Sales Team',
    desc: 'Blazers and golf. Revenue x2.',
    cost: 3_000_000,
    effect: [{ type: 'revenue_mult', amount: 2 }],
    req: { building: 'datacenter_wing', count: 1 },
  },
  {
    id: 'agi_research',
    name: 'AGI Research Lab',
    desc: 'The models improve themselves now. All FLOPS x2.',
    cost: 40_000_000,
    effect: [{ type: 'flops_mult', amount: 2 }],
    req: { building: 'quantum', count: 1 },
  },
]

export const UPGRADE_MAP = Object.fromEntries(UPGRADES.map((u) => [u.id, u]))
