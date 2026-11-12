// 1-BIT RENAISSANCE asset pipeline.
// raw/ personal photos → Bayer 8×8 ordered dithering → true 1-bit PNG + AVIF in public/d/
// Also writes src/data/asset-manifest.json (exact sizes for CLS-safe <img>).
// portrait-id.jpg: prints the owner's legal name at the bottom — that band is
// cropped off automatically (no name anywhere on the site, by design).
// Run: `npm run assets`
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import sharp from "sharp";

// Bayer 8×8 ordered-dithering matrix (values 0..63 → threshold /64)
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const JOBS = [
  { in: "raw/portrait-field.png", name: "portrait-field", w: 860 }, // (unused since rev.2 — kept for rollback)
  { in: "raw/portrait-id.jpg", name: "portrait-id", w: 620, cropBottom: 0.16 }, // name band cropped
  { in: "raw/life-concert.png", name: "life-concert", w: 760 },
  { in: "raw/life-street.jpg", name: "life-street", w: 760 },
  { in: "raw/life-mirror.jpg", name: "life-mirror", w: 760 },
  // hero orb: source is already 1-bit dithered — never re-contrast it; 2× nearest upscale keeps pixels hard
  { in: "raw/hand-orb.jpg", name: "hand-orb", w: 1440, normalise: false, upscale: true },
];

mkdirSync("public/d", { recursive: true });
mkdirSync("src/data", { recursive: true });

const manifest = {};

for (const job of JOBS) {
  if (!existsSync(job.in)) {
    console.warn(`!! missing ${job.in} — skipped (drop the photo into raw/ and re-run)`);
    continue;
  }
  let img = sharp(job.in).rotate(); // respect EXIF orientation
  if (job.cropBottom) {
    const meta = await img.metadata();
    const cut = Math.max(0, Math.floor((meta.height ?? 0) * job.cropBottom));
    img = img.extract({ left: 0, top: 0, width: meta.width, height: (meta.height ?? 0) - cut });
  }
  // grayscale, optional auto contrast, sRGB-linear-ish → single-channel raw bytes
  let pipe = img.resize({
    width: job.w,
    withoutEnlargement: !job.upscale,
    ...(job.upscale ? { kernel: "nearest" } : {}),
  }).greyscale();
  if (job.normalise !== false) pipe = pipe.normalise();
  const { data, info } = await pipe
    .toColourspace("b-w")
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bit = Buffer.alloc(width * height, 0, 1); // 1 byte per px: 0 | 255
  for (let y = 0; y < height; y++) {
    const row = y % 8;
    for (let x = 0; x < width; x++) {
      const v = data[y * width * channels + x * channels];
      const t = (BAYER[row][x % 8] + 0.5) / 64;
      bit[y * width + x] = v / 255 > t ? 255 : 0;
    }
  }

  const png = await sharp(bit, { raw: { width, height, channels: 1 } })
    .png({ palette: true, colours: 2, compressionLevel: 9, effort: 10 })
    .toFile(`public/d/${job.name}.png`);
  const avif = await sharp(bit, { raw: { width, height, channels: 1 } })
    .avif({ quality: 60 })
    .toFile(`public/d/${job.name}.avif`);

  manifest[job.name] = { width, height, png: png.size, avif: avif.size };
  console.log(
    `${job.name}.png ${width}x${height} · ${(png.size / 1024).toFixed(0)} KB · avif ${(avif.size / 1024).toFixed(0)} KB`
  );
}

writeFileSync("src/data/asset-manifest.json", JSON.stringify(manifest, null, 2));
console.log("manifest → src/data/asset-manifest.json");
