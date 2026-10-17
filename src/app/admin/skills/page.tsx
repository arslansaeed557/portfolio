import { getSkillsByCategory } from "@/lib/queries";
import { createSkill, deleteSkill } from "@/lib/actions";
import { inputClass } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const groups = await getSkillsByCategory();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
      <p className="mt-1 text-sm text-muted">
        Grouped by category on the public page. Reuse a category name to add to that group.
      </p>

      <form
        action={createSkill}
        className="mt-8 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input name="name" required placeholder="Ruby on Rails" className={inputClass} />
        <input name="category" placeholder="Backend" className={inputClass} />
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-dim"
        >
          Add
        </button>
      </form>

      <div className="mt-8 space-y-6">
        {groups.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No skills yet.
          </p>
        ) : null}

        {groups.map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-2.5 font-mono text-xs uppercase tracking-wider text-muted">
              {category}
            </h2>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <form
                  key={skill.id}
                  action={deleteSkill}
                  className="group inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
                >
                  <input type="hidden" name="id" value={skill.id} />
                  {skill.name}
                  <button
                    type="submit"
                    aria-label={`Remove ${skill.name}`}
                    className="text-muted transition hover:text-red-400"
                  >
                    ×
                  </button>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
