"use client";

import { useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import type { IntroVideo as IntroVideoData } from "@/lib/video";

/**
 * Autoplay with sound is blocked by every modern browser, so the video starts
 * muted and offers an obvious control to turn sound on. Hosted embeds carry
 * their own controls; only a direct file gets ours.
 */
export function IntroVideo({ video, name }: { video: IntroVideoData; name: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  if (video.kind === "embed") {
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

  function toggleSound() {
    const el = ref.current;
    if (!el) return;

    const next = !muted;
    el.muted = next;
    setMuted(next);

    // A muted autoplay may still be paused on some browsers; nudge it.
    if (!next) {
      el.play().catch(() => {});
      setStarted(true);
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
      <video
        ref={ref}
        src={video.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setStarted(true)}
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

      {!started ? (
        <button
          type="button"
          onClick={() => {
            ref.current?.play().catch(() => {});
            setStarted(true);
          }}
          aria-label="Play introduction"
          className="absolute inset-0 grid place-items-center bg-bg/40 transition hover:bg-bg/30"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-bg">
            <Play className="h-6 w-6 translate-x-0.5" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
