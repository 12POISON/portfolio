// CLASS AUDIT — every className token used in TSX must exist in globals.css
import fs from "node:fs";
import path from "node:path";

let tsx = "";
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(p)) tsx += fs.readFileSync(p, "utf8");
  }
})("src");

const css = fs.readFileSync("src/app/globals.css", "utf8");

// classes used in JSX (static tokens incl. template-literal parts)
const used = new Set();
for (const m of tsx.matchAll(/className=\{?[`'"]([^`'"]+)/g)) {
  for (const t of m[1].split(/[\s${}]+/)) {
    if (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(t)) used.add(t);
  }
}

// classes defined in css
const defined = new Set();
for (const m of css.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]+)/g)) defined.add(m[1]);

const missing = [...used].filter((c) => !defined.has(c)).sort();
const unused = [...defined].filter((c) => !used.has(c)).sort();
console.log("MISSING (used in TSX, no CSS rule):", JSON.stringify(missing));
console.log("UNUSED CSS classes (" + unused.length + "):", JSON.stringify(unused));
