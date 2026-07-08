// Achievements. `check(state, stats)` returns true when unlocked.
export const ACHIEVEMENTS = [
  {
    id: 'first_click',
    name: 'Hello, World',
    desc: 'Generate your first FLOPS by hand.',
    check: (s) => s.clicks >= 1,
  },
  {
    id: 'first_build',
    name: 'Rack and Roll',
    desc: 'Buy your first piece of hardware.',
    check: (s) => Object.values(s.buildings).some((c) => c > 0),
  },
  {
    id: 'ten_pis',
    name: 'Pi Swarm',
    desc: 'Own 10 Raspberry Pis.',
    check: (s) => (s.buildings.pi || 0) >= 10,
  },
  {
    id: 'overheat',
    name: 'It\'s Getting Hot',
    desc: 'Let heat exceed your cooling capacity.',
    check: (s, st) => st.heat > st.cooling && st.cooling > 0,
  },
  {
    id: 'gpu_baron',
    name: 'GPU Baron',
    desc: 'Own 10 GPU Clusters.',
    check: (s) => (s.buildings.gpu_cluster || 0) >= 10,
  },
  {
    id: 'millionaire',
    name: 'Seven Figures',
    desc: 'Bank $1,000,000.',
    check: (s) => s.money >= 1_000_000,
  },
  {
    id: 'quantum_leap',
    name: 'Quantum Leap',
    desc: 'Build a Quantum Prototype.',
    check: (s) => (s.buildings.quantum || 0) >= 1,
  },
  {
    id: 'singularity',
    name: 'Singularity',
    desc: 'Perform your first Singularity Reset.',
    check: (s) => s.resets >= 1,
  },
  {
    id: 'billionaire',
    name: 'Ten Figures',
    desc: 'Bank $1,000,000,000.',
    check: (s) => s.money >= 1_000_000_000,
  },
  {
    id: 'dyson',
    name: 'Kardashev Ambitions',
    desc: 'Build a Dyson Swarm Node.',
    check: (s) => (s.buildings.dyson_node || 0) >= 1,
  },
]
