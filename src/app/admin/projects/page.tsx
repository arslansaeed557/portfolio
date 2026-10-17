import Link from "next/link";
import { Plus } from "lucide-react";
import { getProjects, splitTech } from "@/lib/queries";
import { deleteProject } from "@/lib/actions";
import { ReorderButtons } from "@/components/admin/ReorderButtons";

import { ActionAlert } from "@/components/admin/ActionAlert";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const projects = await getProjects();

  return (
    <div>
      <ActionAlert error={error} />
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            {projects.length} total · use the arrows to reorder
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-dim"
        >
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No projects yet. Add your first one.
          </p>
        ) : null}

        {projects.map((project, index) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4"
          >
            <ReorderButtons
              id={project.id}
              kind="project"
              isFirst={index === 0}
              isLast={index === projects.length - 1}
              label={project.title}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-medium">{project.title}</h2>
                {project.featured ? (
                  <span className="shrink-0 rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] uppercase text-accent">
                    Featured
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 truncate text-sm text-muted">{project.summary}</p>
              <p className="mt-1 truncate font-mono text-xs text-muted/70">
                {splitTech(project.techStack).join(" · ")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link href={`/admin/projects/${project.id}`} className="text-sm text-accent hover:underline">
                Edit
              </Link>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={project.id} />
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
