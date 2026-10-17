import { notFound } from "next/navigation";
import { getProject } from "@/lib/queries";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(Number(id));
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
