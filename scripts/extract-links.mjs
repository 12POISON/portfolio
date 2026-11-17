// EXTRACT LINKS — pull every URI annotation out of a PDF (raw + inflated streams)
import fs from "node:fs";
import zlib from "node:zlib";

const buf = fs.readFileSync("public/resume.pdf");
const found = new Set();

// 1. URIs in plain (uncompressed) objects
const raw = buf.toString("latin1");
for (const m of raw.matchAll(/\/URI\s*\(([^)]+)\)/g)) found.add(m[1]);

// 2. inflate every FlateDecode stream and scan the decoded text
let pos = 0;
while (true) {
  const sIdx = buf.indexOf("stream", pos);
  if (sIdx === -1) break;
  const eIdx = buf.indexOf("endstream", sIdx);
  if (eIdx === -1) break;
  // skip the EOL right after "stream"
  let start = sIdx + 6;
  if (buf[start] === 0x0d) start++;
  if (buf[start] === 0x0a) start++;
  const chunk = buf.subarray(start, eIdx);
  try {
    const text = zlib.inflateSync(chunk).toString("latin1");
    for (const m of text.matchAll(/\/URI\s*\(([^)]+)\)/g)) found.add(m[1]);
    for (const m of text.matchAll(/https?:\/\/[^\s()<>"'\]]{8,}/g)) found.add(m[0]);
  } catch {
    /* not an inflate stream — skip */
  }
  pos = eIdx + 9;
}

const urls = [...found].filter((u) => /^https?:\/\//.test(u)).sort();
console.log(urls.join("\n"));
