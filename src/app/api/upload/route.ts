import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel's server-upload body ceiling is 4.5MB.
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Only image and video files are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error:
          "File must be under 4MB — Vercel caps server uploads. For a longer video, host it on YouTube, Vimeo or Loom and paste the link instead.",
      },
      { status: 400 },
    );
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${EXTENSIONS[file.type] ?? "bin"}`;

  // Production (and anywhere a Blob token exists): Vercel Blob.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`portfolio/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url, storage: "vercel-blob" });
  }

  // Vercel's filesystem is read-only, so there's no local fallback there.
  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Image uploads need a Blob store. Add one under Storage in the Vercel dashboard, then redeploy.",
      },
      { status: 503 },
    );
  }

  // Local development: write into public/uploads and serve it statically.
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(
    path.join(uploadDir, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  return NextResponse.json({ url: `/uploads/${filename}`, storage: "local-disk" });
}
