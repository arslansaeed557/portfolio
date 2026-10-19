/**
 * Works out how to play whatever URL is pasted into the intro video field.
 *
 * Every player gets two URLs. The muted one autoplays on load, which browsers
 * permit; the unmuted one is swapped in when the visitor asks for sound, since
 * that click is the gesture browsers require before allowing audio.
 */
export type IntroVideo =
  | { kind: "embed"; provider: string; srcMuted: string; srcSound: string }
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
    const base = `https://www.youtube.com/embed/${yt}`;
    const common = `rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${yt}`;
    return {
      kind: "embed",
      provider: "YouTube",
      srcMuted: `${base}?autoplay=1&mute=1&${common}`,
      srcSound: `${base}?autoplay=1&mute=0&${common}`,
    };
  }

  if (url.hostname.includes("vimeo.com")) {
    const id = url.pathname.split("/").filter(Boolean).pop();
    if (id) {
      const base = `https://player.vimeo.com/video/${id}`;
      return {
        kind: "embed",
        provider: "Vimeo",
        srcMuted: `${base}?autoplay=1&muted=1&title=0&byline=0`,
        srcSound: `${base}?autoplay=1&muted=0&title=0&byline=0`,
      };
    }
  }

  if (url.hostname.includes("loom.com")) {
    const id = url.pathname.split("/").filter(Boolean).pop();
    if (id) {
      const base = `https://www.loom.com/embed/${id}`;
      const chrome =
        "hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_title=true";
      return {
        kind: "embed",
        provider: "Loom",
        srcMuted: `${base}?autoplay=1&muted=1&${chrome}`,
        srcSound: `${base}?autoplay=1&muted=0&${chrome}`,
      };
    }
  }

  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url.pathname)) {
    return { kind: "file", src: trimmed };
  }

  return { kind: "embed", provider: "Video", srcMuted: trimmed, srcSound: trimmed };
}
