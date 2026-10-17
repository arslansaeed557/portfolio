import { dbConfigured } from "@/lib/demo";

/** Shown in the admin panel while DATABASE_URL is unset — edits can't persist yet. */
export function DbNotice() {
  if (dbConfigured()) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
      <p className="font-medium text-amber-300">No database connected yet</p>
      <p className="mt-1 text-amber-200/80">
        The site is showing demo content. Add your Neon <code>DATABASE_URL</code> to{" "}
        <code>.env.local</code>, then run <code>npm run db:push</code> and{" "}
        <code>npm run db:seed</code> to start saving real content.
      </p>
    </div>
  );
}
