"use client";

import { useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import type { IntroVideo as IntroVideoData } from "@/lib/video";

/**
 * No browser will start a video with sound on its own — and Loom's autoplay is
 * unreliable even muted. So a hosted embed shows a poster with a play button
 * and is only mounted once clicked: that click is the user gesture that lets
 * it start with sound, from the beginning.
 *
 * A direct video file can autoplay muted, so it does, with its own toggle.
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
  const [playing, setPlaying] = useState(false);

  /* ----------------------------------------------------- hosted embeds --- */
  if (video.kind === "embed") {
    if (!playing) {
      const still = poster ?? avatarUrl ?? null;

      return (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${name}'s introduction with sound`}
          className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40"
        >
          {still ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={still}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition group-hover:opacity-70"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/40 to-transparent" />
            </>
          ) : (
            <span className="hero-glow absolute inset-0">
              <span className="grid-bg absolute inset-0" />
            </span>
          )}

          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-bg shadow-lg shadow-accent/25 transition group-hover:scale-105">
              <Play className="h-7 w-7 translate-x-0.5" />
            </span>
          </span>

          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4 text-sm font-medium text-text">
            <Volume2 className="h-4 w-4 text-accent" />
            Play introduction — with sound
          </span>
        </button>
      );
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
        <div className="relative aspect-video">
          <iframe
            src={video.src}
            title={`${name} — introduction`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
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

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Turn sound on" : "Mute video"}
        className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-bg/80 px-3 py-2 text-xs font-medium text-text backdrop-blur transition hover:bg-bg"
      >
        {muted ? (
          <>
            <Volume2 className="h-4 w-4 text-accent" /> Turn on sound
          </>
        ) : (
          <>
            <VolumeX className="h-4 w-4" /> Mute
          </>
        )}
      </button>
    </div>
  );
}
