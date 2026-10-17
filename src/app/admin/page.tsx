import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getExperiences, getMessages, getProfile, getProjects, getSkills } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [profile, projects, experiences, skills, messages] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperiences(),
    getSkills(),
    getMessages(),
  ]);

  const unread = messages.filter((message) => !message.read).length;

  const cards = [
    { href: "/admin/projects", label: "Projects", value: projects.length },
    { href: "/admin/experience", label: "Experience", value: experiences.length },
    { href: "/admin/skills", label: "Skills", value: skills.length },
    { href: "/admin/messages", label: "Unread messages", value: unread },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {profile.name}</h1>
      <p className="mt-1 text-sm text-muted">
        Everything you change here goes live on the site immediately.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-border bg-surface p-5 transition hover:border-accent/40"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{card.value}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-accent opacity-0 transition group-hover:opacity-100">
              Manage <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
