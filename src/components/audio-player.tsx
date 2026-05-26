"use client";

import { useState, useRef, useEffect, useCallback } from "react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
}: {
  src: string;
  title?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const time = Number(e.target.value);
      audio.currentTime = time;
      setCurrentTime(time);
    },
    []
  );

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const vol = Number(e.target.value);
      audio.volume = vol;
      setVolume(vol);
    },
    []
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="my-4 p-3 bg-surface border border-border rounded-lg">
      <audio ref={audioRef} src={src} preload="metadata" />
      {title && (
        <div className="text-xs text-text-tertiary mb-2 truncate">
          {title}
        </div>
      )}
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover transition-colors shrink-0"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Time & progress */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-text-tertiary font-mono w-10 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative h-1.5">
            <div className="absolute inset-0 bg-muted rounded-full" />
            <div
              className="absolute inset-y-0 left-0 bg-accent rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Seek"
            />
          </div>
          <span className="text-xs text-text-tertiary font-mono w-10 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolume}
            className="w-16 h-1 accent-accent cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
