import { notFound } from "next/navigation";
import { getExperience } from "@/lib/queries";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperience(Number(id));
  if (!experience) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit role</h1>
      <ExperienceForm experience={experience} />
    </div>
  );
}
