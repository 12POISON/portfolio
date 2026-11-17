import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Cursor from "@/components/cursor";
import EasterEggs from "@/components/easter-eggs";
import Frame from "@/components/frame";
import LenisProvider from "@/components/lenis-provider";
import MenuOverlay from "@/components/menu-overlay";
import Preloader from "@/components/preloader";
import ScrollDirector from "@/components/scroll-director";
import { OWNER } from "@/lib/content";
import "./globals.css";

// Fonts: self-hosted woff2 via next/font, latin subset, swap — LCP-safe.
const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://whitejack5.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${OWNER.handle} — ${OWNER.role}`,
    template: `%s — ${OWNER.handle}`,
  },
  description:
    "1-bit monochrome portfolio of an applied AI engineer & full-stack builder: fraud risk engines scored in 53 ms, calibrated credit PD on 1.35M loans, citation-grounded RAG over RBI regulation. B.Tech CE (AI & ML) '28. Visible site shows a handle, not a name — by design.",
  keywords: [
    "applied AI",
    "machine learning",
    "fraud detection",
    "XGBoost",
    "LightGBM",
    "RAG",
    "Next.js",
    "FastAPI",
    "full-stack",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: OWNER.handle,
    title: `${OWNER.handle} — ${OWNER.role}`,
    description:
      "Fraud graphs, calibrated credit risk, citation-grounded retrieval — built while tackling the stride. 1-bit renaissance edition.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover", // full-bleed on notched devices — safe-area insets handle the cutouts
};

// JSON-LD — the ONLY place the legal name appears, invisible to the UI.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Devireddy Bharadwaja Reddy",
  alternateName: OWNER.handle,
  email: `mailto:${OWNER.email}`,
  url: SITE_URL,
  jobTitle: "Applied AI Engineer",
  address: { "@type": "PostalAddress", addressLocality: "Navi Mumbai", addressCountry: "IN" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Ramrao Adik Institute of Technology (D Y Patil University)",
  },
  award: ["Arohan 2.0 National-Level Hackathon (2025) — 4th Place"],
  knowsAbout: [
    "applied machine learning",
    "fraud risk systems",
    "retrieval-augmented generation",
    "model explainability",
    "full-stack web engineering",
  ],
  sameAs: [OWNER.links.github, OWNER.links.linkedin, OWNER.links.leetcode, OWNER.links.instagram, OWNER.links.alt],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${body.variable} ${mono.variable}`}>
      {/* suppressHydrationWarning: browser extensions (Grammarly etc.) inject
          data-new-gr-c-s-check-loaded / data-gr-ext-installed onto <body>
          before React hydrates — that mismatch is theirs, not ours. */}
      <body suppressHydrationWarning>
        <a className="skip-link mono" href="#main">
          SKIP TO CONTENT
        </a>
        <Preloader />
        <Cursor />
        <MenuOverlay />
        <EasterEggs />
        <Frame />
        <LenisProvider>
          <ScrollDirector>
            <main id="main">{children}</main>
          </ScrollDirector>
        </LenisProvider>
        <div className="grain" aria-hidden="true" />
        {/* Shared real-time 1-bit filter — video/elements opt in via CSS
            `filter: grayscale(1) url(#wj-onebit)`. Zero JS. */}
        <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
          <filter id="wj-onebit" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 1" />
              <feFuncG type="discrete" tableValues="0 1" />
              <feFuncB type="discrete" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
        </svg>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
