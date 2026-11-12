import Link from "next/link";

export default function NotFound() {
  return (
    <div className="nf" data-chapter="who">
      <div className="nf-win win">
        <div className="win-bar">
          <span className="win-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="mono win-title">404.err — not in the ledger</span>
          <span className="mono win-meta">0x194</span>
        </div>
        <div className="win-body">
          <p className="serif" style={{ margin: "0 0 14px", fontSize: 22 }}>
            This page was never committed.
          </p>
          <p className="mono" style={{ color: "var(--ink-dim)", margin: 0 }}>
            THE AUDIT CHAIN IS INTACT — THE PATH IS NOT. RETURN TO INDEX.
          </p>
          <p style={{ marginTop: 16 }}>
            <Link href="/" data-hover className="case-link mono" style={{ textDecoration: "none" }}>
              ← INDEX
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
