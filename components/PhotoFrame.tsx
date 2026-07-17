import Image from "next/image";

// §5.5 — photos stay unfiltered; the system lives in the frame: thin graphite
// border, consistent aspect ratio, mono "FIG 01 — description" caption.
// Renders an explicit pending state while Peter's photos are absent.
export function PhotoFrame({
  src,
  alt,
  fig,
  caption,
  aspect = "3 / 2",
}: {
  src?: string;
  alt: string;
  fig: string; // e.g. "01" — explicit so numbering is stable per section
  caption: string;
  // photos keep the standard 3:2 frame; wide renders/diagrams may override
  aspect?: string;
}) {
  return (
    <figure className="border border-line">
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-data tracking-wider text-muted">
              [ IMAGE PENDING ]
            </span>
          </div>
        )}
      </div>
      <figcaption className="border-t border-line px-1 py-0.5 font-mono text-data text-muted">
        <span className="text-fg">FIG {fig}</span> — {caption}
      </figcaption>
    </figure>
  );
}
