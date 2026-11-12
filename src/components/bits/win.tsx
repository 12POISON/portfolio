import type { ReactNode } from "react";

// OS window chrome — the framing device of the whole site.
// Server-safe (no JS). Close buttons are decorative unless onClose is wired
// separately by the popup variant in easter eggs.

export default function Win({
  title,
  meta,
  children,
  className = "",
  bodyClass = "",
}: {
  title: string;
  meta?: string;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <div className={`win ${className}`}>
      <div className="win-bar">
        <span className="win-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="mono win-title">{title}</span>
        <span className="mono win-meta">{meta ?? ""}</span>
      </div>
      <div className={`win-body ${bodyClass}`}>{children}</div>
    </div>
  );
}
