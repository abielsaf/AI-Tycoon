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
2. **Keep tuning late-game balance.** The soft-gate curve and log-scaled
   insights landed, but the post-first-ascension pace still needs a pass.
   Levers: `data/tree.js` node costs, the `pendingInsights` formula,
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
export/import saves (file **or** copy/paste text string) · mobile layout +
ticker fixes · visual progression & upgrade view · difficulty rebalance
(soft-gate curve, log-scaled insights) · skins applied to the EN/ES flag and
guide icons.

## License

[MIT](LICENSE) © abielsaf

---

# 🖥️ AI Tycoon (Español)

Un juego incremental / idle sobre construir un imperio de cómputo con IA —
desde una Raspberry Pi en una caja de zapatos hasta un enjambre de Dyson
cosechando una estrella. Genera FLOPS, véndelos por dinero, reinvierte en
mejor hardware, pelea contra el calor y asciende mediante Reinicios de
Singularidad.

Hecho con **React 19 + Zustand + Vite + Tailwind**. Sin backend — todo corre en
el navegador y se guarda en `localStorage`. Totalmente jugable en **inglés y
español** (se cambia en la cabecera).

![AI Tycoon](docs/screenshot.png)

## Cómo jugar

1. **Haz clic en la terminal** para generar FLOPS (cómputo) a mano — así
   financias tu primera máquina.
2. **Compra hardware** que produce FLOPS automáticamente. Los niveles altos son
   mucho más eficientes por dólar. Compra en lote con **×1 / ×10 / MAX**, o
   **Vende** de vuelta por un reembolso del 50%.
3. **Gestiona el calor.** Toda máquina calienta; si el calor total supera tu
   capacidad de refrigeración, la producción se estrangula. Compra Unidades de
   Refrigeración, Plantas Criogénicas y mejoras de refrigeración para
   mantenerte en verde.
4. **Compra mejoras** — bonificaciones únicas al clic, la producción, la
   refrigeración y los ingresos.
5. **Aprovecha los eventos.** Eventos de mercado aleatorios te benefician o
   perjudican temporalmente (mira el aviso y la píldora de arriba).
6. **Asciende.** Cuando hayas generado suficiente cómputo total, activa un
   **Reinicio de Singularidad** para convertir tu progreso en **Insights de IA**
   permanentes — gástalos en el **Árbol de Ascensión** y desbloquea **skins**
   cosméticos.

El progreso **se autoguarda cada 10 segundos**. El progreso offline se acumula
mientras la pestaña está cerrada (con eficiencia reducida, mejorable en el
árbol). Usa **Exportar / Importar** en la cabecera para respaldar o mover tu
partida.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run dev -- --host   # también expuesto en tu LAN (probar en el móvil)
npm run build      # build de producción en dist/
npm run preview    # previsualizar el build de producción
npm run lint       # eslint
```

## Estructura del proyecto

```
src/
  store/gameStore.js    # store Zustand: estado del juego + matemática pura
  systems/              # gameLoop, saveSystem, sound
  data/                 # buildings, upgrades, events, achievements, tree, skins
  components/           # UI (área de clic, listas, paneles, modales)
  utils/format.js       # formateo compacto de números/dinero/tiempo
```

El balance del juego vive por completo en los archivos de `data/` — ajusta los
números ahí para rebalancear sin tocar la lógica del juego.

## Planeado

1. **Verificar el autoguardado y el "bienvenido de vuelta" al recargar.**
   Confirmar que el autoguardado de 10s escribe y que el modal offline aparece
   tras cerrar y reabrir la pestaña de verdad. El flujo de carga está en
   `App.jsx` → `loadGame()` → `loadState()` (matemática offline); ojo: React
   StrictMode monta el efecto dos veces en dev, así que prueba con
   `npm run preview` (no `npm run dev`) — el modal solo aparece si el tiempo
   ausente supera los 30s.
2. **Seguir ajustando el balance del juego tardío.** La curva de soft-gate y
   los insights en escala logarítmica ya están, pero el ritmo tras la primera
   ascensión aún necesita una pasada. Palancas: costes de nodos en
   `data/tree.js`, la fórmula de `pendingInsights`, `PRESTIGE_UNLOCK` y las
   curvas de coste de edificios y mejoras.
3. **Empaquetado (futuro).** Viabilidad preliminar para no empezar a ciegas:
   una **PWA** (instalable, offline, comparte la partida web) es lo más fácil y
   lo primero; un **`.exe`** de escritorio con **Tauri** es sencillo (usa su
   propio almacenamiento, así que la partida se transfiere con
   Exportar/Importar); **Android** con Capacitor funciona desde Windows;
   **iOS** requiere un Mac y una cuenta de Apple Developer. Al no haber
   backend no hay sincronización automática entre plataformas — el formato de
   guardado ya se mueve con Exportar/Importar.

## Hecho

Soporte inglés/español · vender hardware · 12 niveles de hardware · árbol de
ascensión con prestigio + skins · eventos de mercado con sonido · guía para
nuevos jugadores · exportar/importar partidas (archivo **o** copiar/pegar
texto) · diseño móvil + arreglos del ticker · progresión visual y vista de
mejoras · rebalance de dificultad (curva de soft-gate, insights logarítmicos) ·
skins aplicados a la bandera EN/ES y a los iconos de la guía.

## Licencia

[MIT](LICENSE) © abielsaf
