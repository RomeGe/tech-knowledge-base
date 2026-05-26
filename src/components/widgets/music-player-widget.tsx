"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // seconds
}

const PLAYLIST: Track[] = [
  { id: 1, title: "Deep Focus", artist: "Ambient Works", duration: 245 },
  { id: 2, title: "Coding Flow", artist: "LoFi Beats", duration: 198 },
  { id: 3, title: "Midnight Debug", artist: "Synth Wave", duration: 312 },
  { id: 4, title: "Morning Coffee", artist: "Chill Hop", duration: 176 },
  { id: 5, title: "Terminal Rain", artist: "Dark Ambient", duration: 267 },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function MusicPlayerWidget() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = PLAYLIST[currentTrack];

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            // Next track
            setCurrentTrack((c) => (c + 1) % PLAYLIST.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, track.duration]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  const prevTrack = () => {
    setCurrentTrack((c) => (c - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  const nextTrack = () => {
    setCurrentTrack((c) => (c + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const progressPercent = (progress / track.duration) * 100;

  return (
    <div className="p-4 space-y-4">
      {/* Track info */}
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary">{track.title}</p>
        <p className="text-xs text-text-tertiary">{track.artist}</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-tertiary">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={prevTrack}
          className="p-1 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="上一曲"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors"
          aria-label={playing ? "暂停" : "播放"}
        >
          {playing ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          onClick={nextTrack}
          className="p-1 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="下一曲"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-text-tertiary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 accent-accent"
        />
        <span className="text-xs text-text-tertiary w-8 text-right">{volume}%</span>
      </div>

      {/* Playlist */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-text-secondary mb-2">播放列表</p>
        {PLAYLIST.map((t, i) => (
          <button
            key={t.id}
            onClick={() => {
              setCurrentTrack(i);
              setProgress(0);
            }}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
              i === currentTrack
                ? "bg-accent-subtle text-accent"
                : "hover:bg-surface-hover text-text-secondary"
            }`}
          >
            <span className="text-xs truncate">{t.title}</span>
            <span className="text-xs text-text-tertiary ml-2">
              {formatTime(t.duration)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
