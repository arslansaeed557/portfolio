import Link from "next/link";
import { Plus } from "lucide-react";
import { getExperiences } from "@/lib/queries";
import { deleteExperience } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
          <p className="mt-1 text-sm text-muted">{experiences.length} roles</p>
        </div>
        <Link
          href="/admin/experience/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-dim"
        >
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {experiences.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No roles yet.
          </p>
        ) : null}

        {experiences.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4"
          >
            <div className="min-w-0">
              <h2 className="truncate font-medium">
                {job.role} <span className="text-muted">at</span> {job.company}
              </h2>
              <p className="mt-0.5 font-mono text-xs text-muted">
                {job.startDate} — {job.endDate ?? "Present"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link href={`/admin/experience/${job.id}`} className="text-sm text-accent hover:underline">
                Edit
              </Link>
              <form action={deleteExperience}>
                <input type="hidden" name="id" value={job.id} />
                <button type="submit" className="text-sm text-muted transition hover:text-red-400">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
