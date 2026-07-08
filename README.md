# 🖥️ AI Tycoon

An incremental / idle game about bootstrapping an AI compute empire — from a
Raspberry Pi in a shoebox to a Dyson swarm harvesting a star. Generate FLOPS,
sell them for money, reinvest in bigger hardware, fight the heat, and ascend
through Singularity Resets.

Built with **React 19 + Zustand + Vite + Tailwind**. No backend — everything
runs in the browser and saves to `localStorage`. Fully playable in **English and
Spanish** (toggle in the header).

![AI Tycoon](docs/screenshot.png)

## How to play

1. **Click the terminal** to generate FLOPS (compute) by hand — this funds your
   first machine.
2. **Buy hardware** that produces FLOPS automatically. Higher tiers are far more
   efficient per dollar. Buy in bulk with **×1 / ×10 / MAX**, or **Sell** back
   for a 50% refund.
3. **Manage heat.** Every machine runs hot; if total heat exceeds your cooling
   capacity, production is throttled. Buy Cooling Units, Cryogenic Plants and
   cooling upgrades to stay in the green.
4. **Buy upgrades** — one-time boosts to clicking, production, cooling and
   revenue.
5. **Ride the events.** Random market events temporarily buff or debuff you
   (watch the toast and the pill up top).
6. **Ascend.** Once you've generated enough lifetime compute, trigger a
   **Singularity Reset** to convert progress into permanent **AI Insights** —
   spend them on the **Ascension Tree** and unlock cosmetic **skins**.

Progress **autosaves every 10 seconds**. Offline progress accrues while the tab
is closed (at reduced efficiency, boostable via the tree). Use **Export /
Import** in the header to back up or move your save.

## Development

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
npm run dev -- --host   # also expose on your LAN (test on a phone)
npm run build      # production build to dist/
npm run preview    # preview the production build
npm run lint       # eslint
```

## Project structure

```
src/
  store/gameStore.js    # Zustand store: all game state + pure stat math
  systems/              # gameLoop, saveSystem, sound
  data/                 # buildings, upgrades, events, achievements, tree, skins
  components/           # UI (click area, hardware/upgrade lists, panels, modals)
  utils/format.js       # compact number/money/time formatting
```

Game balance lives entirely in the `data/` files — tweak the numbers there to
rebalance without touching game logic.

## Planned

1. **Verify autosave + "welcome back" on reload.** Confirm the 10s autosave
   writes and the offline modal pops after truly closing/reopening the tab.
   Load flow lives in `App.jsx` → `loadGame()` → `loadState()` (offline math);
   note React StrictMode double-mounts the effect in dev, so test with
   `npm run preview` (not `npm run dev`) — the modal only shows when elapsed
   time away is over 30s.
2. **Review game balance (progression too fast).** Prestige/ascension upgrades
   are currently too cheap, so you reach the full game too quickly. Concrete
   levers: `data/tree.js` node costs, the `pendingInsights` formula,
   `PRESTIGE_UNLOCK`, and the building/upgrade cost curves.
3. **Packaging (future).** Preliminary feasibility so it's not a blind start:
   a **PWA** (installable, offline, shares the web save) is easiest and first;
   a desktop **`.exe`** via **Tauri** is straightforward (its own storage, so
   save transfer is via Export/Import); **Android** via Capacitor works from
   Windows; **iOS** needs a Mac + Apple Developer account. No backend means no
   automatic cross-platform sync — the save format already moves via
   Export/Import.

## Done

English/Spanish support · sell-back hardware · 12 hardware tiers · prestige
ascension tree + skins · market events with sound · new-player guide ·
export/import saves · mobile layout.

## License

[MIT](LICENSE) © abielsaf
