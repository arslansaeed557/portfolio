import { saveProject } from "@/lib/actions";
import { Field, SubmitRow, TextArea } from "./fields";
import { ImageField } from "./ImageField";
import type { Project } from "@/lib/schema";

export function ProjectForm({ project }: { project?: Project | null }) {
  return (
    <form action={saveProject} className="mt-8 space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <Field label="Title" name="title" defaultValue={project?.title} required />
      <TextArea
        label="Summary"
        name="summary"
        defaultValue={project?.summary}
        rows={3}
        required
        hint="One or two sentences shown on the project card."
      />
      <TextArea
        label="Full description"
        name="description"
        defaultValue={project?.description}
        rows={5}
        hint="Optional longer write-up."
      />
      <Field
        label="Tech stack"
        name="techStack"
        defaultValue={project?.techStack}
        placeholder="Rails, Postgres, Sidekiq, Redis"
        hint="Comma-separated."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Live URL" name="liveUrl" defaultValue={project?.liveUrl} />
        <Field label="Repo URL" name="repoUrl" defaultValue={project?.repoUrl} />
      </div>

      <ImageField name="imageUrl" label="Cover image" defaultValue={project?.imageUrl} />

      <div className="grid items-end gap-5 sm:grid-cols-2">
        <Field
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={project?.sortOrder ?? 0}
          hint="Lower numbers appear first."
        />
        <label className="flex items-center gap-2.5 pb-2.5 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured ?? false}
            className="h-4 w-4 accent-[#5eead4]"
          />
          Featured project
        </label>
      </div>

      <SubmitRow label={project ? "Save project" : "Create project"} />
    </form>
  );
}
