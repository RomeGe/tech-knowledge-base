// Image with caption using semantic figure/figcaption HTML
export function ImageCaption({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full rounded-lg border border-border"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-text-tertiary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
