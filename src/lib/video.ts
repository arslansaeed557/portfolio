/**
 * Works out how to play whatever URL is pasted into the intro video field.
 *
 * Hosted players (YouTube, Vimeo, Loom) become autoplaying muted embeds;
 * anything else is treated as a direct video file and played inline, which
 * is the only case where we can offer our own sound toggle.
 */
export type IntroVideo =
  | { kind: "embed"; src: string; provider: string }
  | { kind: "file"; src: string };

function youtubeId(url: URL): string | null {
  if (url.hostname.includes("youtu.be")) {
    return url.pathname.slice(1) || null;
  }
  if (url.hostname.includes("youtube.com")) {
    if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] ?? null;
    if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2] ?? null;
    return url.searchParams.get("v");
  }
  return null;
}

export function parseIntroVideo(raw: string | null | undefined): IntroVideo | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Relative uploads (/uploads/clip.mp4) are always files.
  if (trimmed.startsWith("/")) return { kind: "file", src: trimmed };

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const yt = youtubeId(url);
  if (yt) {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: yt, // required for loop to work on a single video
      controls: "1",
      rel: "0",
      modestbranding: "1",
    });
    return {
      kind: "embed",
      provider: "YouTube",
      src: `https://www.youtube.com/embed/${yt}?${params.toString()}`,
    };
  }

  if (url.hostname.includes("vimeo.com")) {
    const id = url.pathname.split("/").filter(Boolean).pop();
    if (id) {
      return {
        kind: "embed",
        provider: "Vimeo",
        src: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&title=0&byline=0`,
      };
    }
  }

  if (url.hostname.includes("loom.com")) {
    const id = url.pathname.split("/").filter(Boolean).pop();
    if (id) {
      return {
        kind: "embed",
        provider: "Loom",
        src: `https://www.loom.com/embed/${id}?autoplay=1&muted=1`,
      };
    }
  }

  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url.pathname)) {
    return { kind: "file", src: trimmed };
  }

  // Unknown host: assume it can be embedded rather than dropping it silently.
  return { kind: "embed", provider: "Video", src: trimmed };
}
