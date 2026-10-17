/** Shown when a write was rejected because no database is connected. */
export function ActionAlert({ error }: { error?: string }) {
  if (error !== "nodb") return null;

  return (
    <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm">
      <p className="font-medium text-red-300">Couldn&apos;t save — no database connected</p>
      <p className="mt-1 text-red-200/80">
        Add your <code>DATABASE_URL</code> to <code>.env.local</code>, then run{" "}
        <code>npm run db:push</code>. Your changes were not stored.
      </p>
    </div>
  );
}
