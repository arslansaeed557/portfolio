import { saveExperience } from "@/lib/actions";
import { Field, SubmitRow, TextArea } from "./fields";
import type { Experience } from "@/lib/schema";

export function ExperienceForm({ experience }: { experience?: Experience | null }) {
  return (
    <form action={saveExperience} className="mt-8 space-y-5">
      {experience ? <input type="hidden" name="id" value={experience.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Role" name="role" defaultValue={experience?.role} required />
        <Field label="Company" name="company" defaultValue={experience?.company} required />
        <Field label="Location" name="location" defaultValue={experience?.location} />
        <Field
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={experience?.sortOrder ?? 0}
          hint="Lower numbers appear first."
        />
        <Field
          label="Start date"
          name="startDate"
          defaultValue={experience?.startDate}
          required
          placeholder="Jan 2022"
        />
        <Field
          label="End date"
          name="endDate"
          defaultValue={experience?.endDate}
          placeholder="Leave blank for Present"
        />
      </div>

      <TextArea
        label="Description"
        name="description"
        defaultValue={experience?.description}
        rows={6}
        hint="One achievement per line works well."
      />
      <Field
        label="Tech stack"
        name="techStack"
        defaultValue={experience?.techStack}
        placeholder="Rails, Node.js, AWS"
        hint="Comma-separated."
      />

      <SubmitRow label={experience ? "Save role" : "Add role"} />
    </form>
  );
}
