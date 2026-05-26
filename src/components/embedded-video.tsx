// Video embed component supporting YouTube, Bilibili, and direct URLs

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function getBilibiliId(url: string): string | null {
  const m = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export function EmbeddedVideo({
  url,
  title = "Video",
  className = "",
}: {
  url: string;
  title?: string;
  className?: string;
}) {
  const ytId = getYouTubeId(url);
  const biliId = getBilibiliId(url);

  if (ytId) {
    return (
      <div className={`my-6 ${className}`}>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    );
  }

  if (biliId) {
    return (
      <div className={`my-6 ${className}`}>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${biliId}&high_quality=1`}
            title={title}
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    );
  }

  if (isDirectVideoUrl(url)) {
    return (
      <div className={`my-6 ${className}`}>
        <div className="rounded-lg overflow-hidden border border-border">
          <video
            src={url}
            controls
            preload="metadata"
            className="w-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }

  // Fallback: render as link
  return (
    <div className={`my-6 ${className}`}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-accent hover:text-accent-hover underline underline-offset-2 text-sm"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z"
          />
        </svg>
        {title}
      </a>
    </div>
  );
}
