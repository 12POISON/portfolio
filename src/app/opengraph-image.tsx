import { ImageResponse } from "next/og";

// OG image — dithered checker motif + handle + tagline. No external fetches
// (build-safe), no name: the handle is the public identity, per the brief.

export const alt = "WHITEJACK5 — 1-bit renaissance portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// deterministic dither dot field
const DOTS: [number, number, number][] = [];
for (let y = 0; y < 21; y++) {
  for (let x = 0; x < 40; x++) {
    const bayer = (x % 4) * 4 + (y % 4);
    if ([0, 5, 10, 15, 3, 12].includes(bayer)) DOTS.push([x, y, (x + y) % 2]);
  }
}

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#EDECE8",
          padding: 64,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex", flexWrap: "wrap" }}>
          {DOTS.map(([x, y, o], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x * 30 + 12,
                top: y * 30 + 12,
                width: 7,
                height: 7,
                background: "#EDECE8",
                opacity: o ? 0.14 : 0.06,
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, opacity: 0.6 }}>
          <div>01 / WHO — 07 / SIGNAL</div>
          <div>1-BIT · BAYER-8</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -2 }}>WHITEJACK5</div>
          <div style={{ fontSize: 34, opacity: 0.75, letterSpacing: 8 }}>TACKLING THE STRIDE</div>
          <div style={{ fontSize: 22, opacity: 0.5, letterSpacing: 2 }}>
            APPLIED AI · FRAUD GRAPHS · CALIBRATED RISK · CITATION-GROUNDED RAG
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, opacity: 0.5, letterSpacing: 3 }}>
          <div>19.03N 73.01E / NAVI MUMBAI</div>
          <div>V1.0</div>
        </div>
      </div>
    ),
    size
  );
}
