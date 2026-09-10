# WASM Sim Interface — the Embind contract (§6.1, archived)

> Archived on 2026-08-29. The current product direction does not include an
> embedded simulation demo, so this is not an active roadmap specification.

This is the interface the site's telemetry demo will be built against, and the
contract that decides content tiers (§8): a recompiled binary that keeps this
surface is a **tier-2 drop-in swap**; changing the surface is tier-3 (needs a
JS-side session too). Compilation happens on Peter's toolchain (§7); the site
owns everything from the loader outward.

## Design rule: fixed methods, dynamic channels

The method surface below never changes. What *varies* is the channel list —
discovered at runtime by name. Adding a new tracked quantity in C++ (a new
aggregate, a new estimator output) requires **no JS change and no interface
change**: the chart picks up the new channel from `channelNames()`. This is
what keeps future recompiles tier-2.

## C++ surface

```cpp
#include <emscripten/bind.h>
using namespace emscripten;

class SimHandle {
public:
  // deterministic (re)initialization — same seed, same run (scrub/replay
  // integrity depends on this)
  void reset(uint32_t scale, uint32_t seed);

  // advance one fixed step; dt in seconds (caller passes the sim's own
  // canonical fixed dt; implementations may ignore other values)
  void step(float dt);

  double time() const;                        // sim-seconds since reset

  // telemetry: aggregate scalars ONLY, computed C++-side (§6.1 — the full
  // field never crosses the boundary). Order of sample() matches
  // channelNames(); both stable within a run.
  std::vector<std::string> channelNames() const;
  std::vector<double> sample() const;

  // bumped only when THIS surface changes shape (tier-3 event)
  static uint32_t interfaceVersion();         // currently 1
};

EMSCRIPTEN_BINDINGS(sim) {
  register_vector<std::string>("VectorString");
  register_vector<double>("VectorDouble");
  class_<SimHandle>("SimHandle")
      .constructor<>()
      .function("reset", &SimHandle::reset)
      .function("step", &SimHandle::step)
      .function("time", &SimHandle::time)
      .function("channelNames", &SimHandle::channelNames)
      .function("sample", &SimHandle::sample)
      .class_function("interfaceVersion", &SimHandle::interfaceVersion);
}
```

Notes:
- `reset(scale, seed)`: `scale` is sim-defined (FluidSim: particle count;
  quadrotor: unused/0). The demo UI treats it as an opaque knob with a
  sim-supplied default.
- No stdout/console reporting (§6.1) — channels are the only telemetry path.
- Scrubbing is a JS-side concern: the loader records `sample()` each step
  into a ring buffer and replays it; C++ never needs to rewind.

## Build (Emscripten)

```sh
emcc <headless sources> -Iinclude -std=c++17 -O3 -lembind \
  -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=createSimModule \
  -sALLOW_MEMORY_GROWTH=1 -sENVIRONMENT=web \
  -o fluidsim.js
```

Output lands at `/public/wasm/<project>/<project>.js` + `.wasm` (§7 layout).
The `.js` glue and `.wasm` move together — a swap is always the pair.

## Per-project notes

### Quadrotor — recommended first target

Pure CPU C++ (Eigen + RK4) compiles to WASM without redesign. Suggested
channels once phases 2–3 exist, matching the §6.1 trace spec (true state
thin/muted, noisy reading faint/dotted, Kalman estimate solid accent):
`x_true`, `z_true`, `theta_true`, `x_meas`, `z_meas`, `theta_meas`,
`x_est`, `z_est`, `theta_est`, plus inputs `u1`, `u2`. A physics-only build
(current phase 1) can ship earlier with just true-state channels — the chart
renders whatever channels exist.

### FluidSim — honest caveat, decision needed from Peter

The physics lives in GLSL compute shaders; WebGL2 has no compute, so the
existing GPU path cannot compile to WASM as-is. Options, Peter's call:
1. **CPU port of the SPH step at reduced particle count** (a few thousand
   particles instead of ~300k) behind this same interface — most faithful to
   "the real sim, embedded," clearly labeled as the reduced-scale build.
2. Defer FluidSim's demo; ship the quadrotor demo first (no porting work).

Suggested FluidSim channels: `avg_density`, `max_pressure`, `avg_speed`,
`kinetic_energy`, `particle_count`.

## Loader contract (site side, built when the first binary exists)

- `const mod = await createSimModule()` → `new mod.SimHandle()`
- Loader checks `SimHandle.interfaceVersion() === 1` and fails visibly (mono
  error readout) on mismatch — a silent wrong-interface swap must not look
  like a working demo.
- Lazy: module instantiated only when the sim section scrolls into view
  (§6.1); same gate pattern as the CAD reveal.
