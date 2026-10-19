/**
 * Works out how to play whatever URL is pasted into the intro video field.
 *
 * Hosted players (YouTube, Vimeo, Loom) become embeds that are only mounted
 * after the visitor clicks play — a click is a user gesture, which is the one
 * thing that lets a video start *with sound*. Browsers block unmuted autoplay
 * outright, and Loom's own docs warn its autoplay is unreliable regardless.
 *
 * A direct video file is different: it can autoplay muted straight away, so it
 * does, with its own control to turn sound on.
 */
export type IntroVideo =
  | { kind: "embed"; src: string; provider: string }
  | { kind: "file"; src: string };

function youtubeId(url: URL): string | null {
  if (url.hostname.includes("youtu.be")) return url.pathname.slice(1) || null;
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
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
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
        src: `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0`,
      };
    }
  }

  if (url.hostname.includes("loom.com")) {
    const id = url.pathname.split("/").filter(Boolean).pop();
    if (id) {
      const params = new URLSearchParams({
        autoplay: "1",
        hideEmbedTopBar: "true",
        hide_owner: "true",
        hide_share: "true",
        hide_title: "true",
      });
      return {
        kind: "embed",
        provider: "Loom",
        src: `https://www.loom.com/embed/${id}?${params.toString()}`,
      };
    }
  }

  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url.pathname)) {
    return { kind: "file", src: trimmed };
  }

  return { kind: "embed", provider: "Video", src: trimmed };
}
