const PIPELINE_STEPS = [
  {
    number: "01",
    title: "Particle state",
    detail: "Positions and velocities live in OpenGL shader storage buffers.",
  },
  {
    number: "02",
    title: "Spatial hash",
    detail: "Particles are grouped into cells to narrow each neighbor search.",
  },
  {
    number: "03",
    title: "SPH passes",
    detail: "Compute shaders update density, pressure, viscosity, and gravity.",
  },
  {
    number: "04",
    title: "Instanced draw",
    detail: "Velocity-colored quads render directly from the updated state.",
  },
] as const;

export function FluidSimPipeline() {
  return (
    <section aria-labelledby="fluid-pipeline-title" className="mb-6">
      <p className="font-mono text-data uppercase tracking-wide text-muted">
        One simulation frame
      </p>
      <h2 id="fluid-pipeline-title" className="mt-1 text-2xl font-medium">
        Data stays on the GPU
      </h2>
      <ol className="mt-3 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {PIPELINE_STEPS.map((step) => (
          <li
            key={step.number}
            className="relative min-h-8 border-r border-b border-line p-2"
          >
            <span className="font-mono text-data text-accent-text">
              {step.number}
            </span>
            <h3 className="mt-2 font-medium">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
