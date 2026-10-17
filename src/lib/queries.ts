import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { experiences, messages, profile, projects, skills } from "./schema";
import type { Experience, Message, Profile, Project, Skill } from "./schema";
import {
  DEMO_EXPERIENCES,
  DEMO_PROFILE,
  DEMO_PROJECTS,
  DEMO_SKILLS,
  dbConfigured,
} from "./demo";

export { dbConfigured };

export async function getProfile(): Promise<Profile> {
  if (!dbConfigured()) return DEMO_PROFILE;
  const rows = await db.select().from(profile).where(eq(profile.id, 1)).limit(1);
  return rows[0] ?? DEMO_PROFILE;
}

export async function getProjects(): Promise<Project[]> {
  if (!dbConfigured()) return DEMO_PROJECTS;
  // Ordered purely by sortOrder so the admin list matches the public page;
  // `featured` controls how a project is presented, not where it sits.
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
}

export async function getProject(id: number): Promise<Project | null> {
  if (!dbConfigured()) return DEMO_PROJECTS.find((item) => item.id === id) ?? null;
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getExperiences(): Promise<Experience[]> {
  if (!dbConfigured()) return DEMO_EXPERIENCES;
  return db.select().from(experiences).orderBy(asc(experiences.sortOrder));
}

export async function getExperience(id: number): Promise<Experience | null> {
  if (!dbConfigured()) return DEMO_EXPERIENCES.find((item) => item.id === id) ?? null;
  const rows = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getSkills(): Promise<Skill[]> {
  if (!dbConfigured()) return DEMO_SKILLS;
  return db.select().from(skills).orderBy(asc(skills.category), asc(skills.sortOrder));
}

/** Skills bucketed by category, preserving category order. */
export async function getSkillsByCategory(): Promise<[string, Skill[]][]> {
  const all = await getSkills();
  const grouped = new Map<string, Skill[]>();
  for (const item of all) {
    const bucket = grouped.get(item.category) ?? [];
    bucket.push(item);
    grouped.set(item.category, bucket);
  }
  return [...grouped.entries()];
}

export async function getMessages(): Promise<Message[]> {
  if (!dbConfigured()) return [];
  return db.select().from(messages).orderBy(desc(messages.createdAt));
}

export function splitTech(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
