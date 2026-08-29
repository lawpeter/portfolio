"use client";

import dynamic from "next/dynamic";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Prose } from "@/components/Prose";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useSectionProgress } from "@/lib/useScrollProgress";
import { SUBSYSTEMS, SUBSYSTEM_IDS } from "./subsystems";

const WalkthroughStage = dynamic(() => import("./WalkthroughStage"), {
  ssr: false,
});

export function RobotWalkthrough({
  body,
  modelPath,
}: {
  body: string;
  modelPath: string;
}) {
  const viewerEnabled = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { activeId, activeIndex, registerSection, subscribe } =
    useSectionProgress(SUBSYSTEM_IDS);

  return (
    <>
      <Prose>{body}</Prose>

      <nav
        aria-label="Robot subsystems"
        className="mt-4 flex flex-wrap gap-1 border-y border-line py-1"
      >
        {SUBSYSTEMS.map((subsystem, index) => (
          <a
            key={subsystem.id}
            href={`#robot-${subsystem.id}`}
            aria-current={activeId === subsystem.id ? "true" : undefined}
            className={`border px-1 py-0.5 text-sm underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              activeId === subsystem.id
                ? "border-accent text-fg"
                : "border-line text-muted hover:text-fg"
            }`}
          >
            <span className="mr-0.5 font-mono text-data text-accent-text">
              {String(index + 1).padStart(2, "0")}
            </span>
            {subsystem.label.charAt(0) + subsystem.label.slice(1).toLowerCase()}
          </a>
        ))}
      </nav>

      <div className="mt-4 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
        <div className="space-y-8">
          <section
            id="robot-chassis"
            ref={registerSection("chassis")}
            className="scroll-mt-8"
          >
            <p className="font-mono text-data text-muted">01 / CHASSIS</p>
            <h2 className="mt-1 text-2xl font-medium">A team-built structure</h2>
            <div className="mt-2 space-y-2 leading-relaxed">
              <p>
                The chassis carries the drive system, electronics, and the
                lasercut side panels that gave the finished robot its identity.
                My teammates did most of this mechanical design and its Onshape
                CAD. I contributed during manufacturing and integration rather
                than presenting their work as mine.
              </p>
              <p>
                The complete assembly is shown here as system context: six
                people built one robot, and the subsystems only make sense in
                relation to one another.
              </p>
            </div>
            <div className="mt-3">
              <PhotoFrame
                src="/photos/stair-robot/stairmaster-side.jpg"
                alt="STAIRMASTER side view"
                fig="01"
                caption="STAIRMASTER with its lasercut side panel and spiked chain-drive tracks"
              />
            </div>
          </section>

          <section
            id="robot-movement"
            ref={registerSection("movement")}
            className="scroll-mt-8"
          >
            <p className="font-mono text-data text-muted">02 / MOVEMENT</p>
            <h2 className="mt-1 text-2xl font-medium">Built to climb the course</h2>
            <div className="mt-2 space-y-2 leading-relaxed">
              <p>
                The movement system combines 12-volt worm-gear motors, gearboxes,
                sprockets, and spiked chain tracks. The mechanical design and CAD
                for this subsystem were my teammates&apos; work. I helped manufacture
                and assemble the robot and then integrated the movement hardware
                with the electronics and controls.
              </p>
              <p>
                The shipped GLB has chain meshes intersecting the sprockets in
                its default pose, so the interactive view hides those meshes.
                The photograph shows the real chain drive accurately.
              </p>
            </div>
            <div className="mt-3">
              <PhotoFrame
                src="/photos/stair-robot/team.jpg"
                alt="ME213 team on competition day"
                fig="02"
                caption="The six-person team with the completed robot on competition day"
              />
            </div>
          </section>

          <section
            id="robot-electronics"
            ref={registerSection("electronics")}
            className="scroll-mt-8"
          >
            <p className="font-mono text-data text-muted">03 / ELECTRONICS</p>
            <h2 className="mt-1 text-2xl font-medium">The subsystem I designed</h2>
            <div className="mt-2 space-y-2 leading-relaxed">
              <p>
                I designed the electronics layout and mounting plate around the
                Arduino, dual motor drivers, battery, power distribution, and
                wiring. I integrated the PS2 controller receiver and wrote the
                control software that translated controller input into motor
                commands.
              </p>
              <p>
                This was the part of the project where my software and
                mechanical coursework met directly: packaging the hardware,
                making reliable connections, and tuning behavior on the physical
                robot all affected one another.
              </p>
            </div>
            <div className="mt-3 space-y-3">
              <PhotoFrame
                src="/photos/stair-robot/internals.jpg"
                alt="Robot chassis internals"
                fig="03"
                caption="Arduino, dual Cytron MD20A drivers, drive motors, and battery inside the chassis"
              />
              <PhotoFrame
                src="/photos/stair-robot/wiring.jpg"
                alt="Robot power and control wiring"
                fig="04"
                caption="Terminal-block distribution, XT60 connectors, and inline fuse"
              />
            </div>
          </section>
        </div>

        {viewerEnabled && (
          <aside className="sticky top-2 hidden md:block">
            <p className="mb-1 font-mono text-data text-muted">
              ACTIVE / {SUBSYSTEMS[activeIndex.current]?.label ?? "CHASSIS"}
            </p>
            <WalkthroughStage
              activeIndex={activeIndex}
              subscribe={subscribe}
              reducedMotion={reducedMotion}
              modelPath={modelPath}
            />
            <p className="mt-1 font-mono text-data text-muted">
              DRAG TO ORBIT / SCROLL TO FOLLOW THE WALKTHROUGH
            </p>
          </aside>
        )}
      </div>
    </>
  );
}
