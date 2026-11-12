// Infinite marquee — pure CSS animation, pauses + inverts on hover.
// Touch-safe: content is also just scrollable row (overflow-x: auto fallback).

const ROW: React.CSSProperties = {
  ["--dur" as string]: "s",
};

export default function Marquee({
  items,
  duration = 28,
  reverse = false,
  className = "",
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  // doubled content for a seamless -50% loop (aria-hidden on the twin)
  const strip = (hidden: boolean) => (
    <span className="marquee-strip" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span className="marquee-item mono" key={i}>
          {t}
          <span className="marquee-sep">/</span>
        </span>
      ))}
    </span>
  );
  return (
    <div
      className={`marquee ${className}`}
      style={{ ...ROW, ["--dur" as string]: `${duration}s`, ["--dir" as string]: reverse ? "reverse" : "normal" }}
    >
      {strip(false)}
      {strip(true)}
    </div>
  );
}
