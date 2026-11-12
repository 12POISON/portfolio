import type { ReactNode } from "react";

// *word* → serif <em> (the ONE emphasized italic word per statement).

export default function Em({ text }: { text: string }): ReactNode {
  const parts = text.split(/\*([^*]+)\*/g);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 === 1 ? <em key={i}>{p}</em> : <span key={i}>{p}</span>));
}
