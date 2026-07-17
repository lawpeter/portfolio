import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeUnwrapImages from "rehype-unwrap-images";

/*
 * Markdown renderer for all tier-1 content (project descriptions, devlog,
 * deep-dives). §3.5 requires images and tables styled to the system rather
 * than browser defaults: graphite-framed figures with mono FIG captions
 * (numbering via CSS counter in globals.css), graphite-bordered tables with
 * mono headers. rehype-unwrap-images lifts images out of <p> so the <figure>
 * markup is valid HTML.
 */
export function Prose({ children }: { children: string }) {
  return (
    <div className="prose max-w-reading text-fg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeUnwrapImages]}
        components={{
          h1: (props) => (
            <h2 className="mt-5 mb-2 text-2xl font-medium" {...props} />
          ),
          h2: (props) => (
            <h2 className="mt-5 mb-2 text-2xl font-medium" {...props} />
          ),
          h3: (props) => (
            <h3 className="mt-4 mb-2 text-xl font-medium" {...props} />
          ),
          h4: (props) => (
            <h4 className="mt-3 mb-1 text-lg font-medium" {...props} />
          ),
          p: (props) => <p className="mb-2 leading-relaxed" {...props} />,
          a: (props) => (
            <a
              className="text-accent-text underline underline-offset-2 hover:text-accent"
              {...props}
            />
          ),
          ul: (props) => (
            <ul className="mb-2 list-disc space-y-0.5 pl-3" {...props} />
          ),
          ol: (props) => (
            <ol className="mb-2 list-decimal space-y-0.5 pl-3" {...props} />
          ),
          blockquote: (props) => (
            <blockquote
              className="mb-2 border-l border-line pl-2 text-muted"
              {...props}
            />
          ),
          code: (props) => (
            <code
              className="bg-panel px-0.5 font-mono text-data"
              {...props}
            />
          ),
          pre: (props) => (
            <pre
              className="mb-3 overflow-x-auto border border-line bg-panel p-2 font-mono text-data [&_code]:bg-transparent [&_code]:p-0"
              {...props}
            />
          ),
          img: ({ src, alt }) => (
            <figure className="my-3 border border-line">
              {/* Peter-supplied static photos; plain <img> keeps markdown
                  tier-1 (no dimension metadata needed per image) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={typeof src === "string" ? src : undefined}
                alt={alt ?? ""}
                loading="lazy"
                className="w-full"
              />
              <figcaption className="border-t border-line px-1 py-0.5 font-mono text-data text-muted">
                {alt}
              </figcaption>
            </figure>
          ),
          table: (props) => (
            <div className="my-3 overflow-x-auto">
              <table
                className="w-full border-collapse border border-line"
                {...props}
              />
            </div>
          ),
          th: (props) => (
            <th
              className="border border-line px-1 py-0.5 text-left font-mono text-data font-medium tracking-wide"
              {...props}
            />
          ),
          td: (props) => (
            <td className="border border-line px-1 py-0.5" {...props} />
          ),
          hr: () => <hr className="my-4 border-line" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
