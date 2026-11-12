import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // no circular "N" dev badge in dev mode
  devIndicators: false,
  // single-repo lockfile root (silences the multi-lockfile warning)
  outputFileTracingRoot: dir,
};

export default nextConfig;
