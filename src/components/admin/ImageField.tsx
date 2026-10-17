"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { inputClass } from "./fields";

/**
 * Image picker that uploads to Vercel Blob and writes the resulting URL into a
 * hidden input. Falls back to pasting a URL when Blob isn't configured.
 */
export function ImageField({
  name,
  label = "Image",
  defaultValue,
}: {
  name: string;
  label?: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setStatus(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setUrl(data.url);
      setStatus("Uploaded");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm transition hover:border-accent/40 hover:text-accent disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : "Upload image"}
        </button>

        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Preview"
            className="h-12 w-20 rounded-md border border-border object-cover"
          />
        ) : null}

        {url ? (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-xs text-muted underline hover:text-text"
          >
            Remove
          </button>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      <input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        name={name}
        placeholder="…or paste an image URL"
        className={`${inputClass} mt-3`}
      />

      {status ? <p className="mt-1 text-xs text-muted">{status}</p> : null}
    </div>
  );
}
