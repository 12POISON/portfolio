import manifest from "@/data/asset-manifest.json";

// Pre-dithered 1-bit asset. Width/height from the pipeline manifest → CLS stays 0.
type Name = keyof typeof manifest;

export default function DitherImg({
  name,
  alt,
  className = "",
  eager = false,
  sizes,
  hero = false,
}: {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
  hero?: boolean;
}) {
  const m = (manifest as Record<string, { width: number; height: number }>)[name];
  if (!m) return null;
  return (
    <picture>
      <source type="image/avif" srcSet={`/d/${name}.avif`} sizes={sizes} />
      <img
        src={`/d/${name}.png`}
        alt={alt}
        width={m.width}
        height={m.height}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding={eager ? "sync" : "async"}
        draggable={false}
        {...(hero ? { "data-hero": true, "data-hero-img": true } : null)}
        className={`pixelated ${className}`}
      />
    </picture>
  );
}
