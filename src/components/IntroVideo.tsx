"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { IntroVideo as IntroVideoData } from "@/lib/video";

/**
 * Starts on its own, muted — that is the only form of autoplay browsers allow.
 * Asking for sound swaps the player to its unmuted URL, which restarts it from
 * the beginning; the click is the gesture that permits audio.
 */
export function IntroVideo({
  video,
  name,
  poster,
  avatarUrl,
}: {
  video: IntroVideoData;
  name: string;
  poster?: string | null;
  avatarUrl?: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const soundButton = (onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold text-bg shadow-lg shadow-black/30 transition hover:bg-accent-dim"
    >
      <Volume2 className="h-4 w-4" />
      Turn on sound
    </button>
  );

  /* ----------------------------------------------------- hosted embeds --- */
  if (video.kind === "embed") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
        <div className="relative aspect-video">
          <iframe
            // Remounts when the source changes, so the swap to sound restarts it.
            key={muted ? "muted" : "sound"}
            src={muted ? video.srcMuted : video.srcSound}
            title={`${name} — introduction`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>

        {muted ? soundButton(() => setMuted(false)) : null}
      </div>
    );
  }

  /* -------------------------------------------------------- direct file --- */
  function toggleSound() {
    const el = ref.current;
    if (!el) return;
    const next = !muted;
    el.muted = next;
    setMuted(next);
    if (!next) el.play().catch(() => {});
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
      <video
        ref={ref}
        src={video.src}
        poster={poster ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="aspect-video w-full object-cover"
      />

      {muted ? (
        soundButton(toggleSound)
      ) : (
        <button
          type="button"
          onClick={toggleSound}
          aria-label="Mute video"
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-bg/80 px-3 py-2 text-xs font-medium text-text backdrop-blur transition hover:bg-bg"
        >
          <VolumeX className="h-4 w-4" /> Mute
        </button>
      )}
    </div>
  );
}
