import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { experiences, messages, profile, projects, skills } from "./schema";
import type { Profile } from "./schema";

/** Shown before the admin has saved a profile, so the site never renders empty. */
export const FALLBACK_PROFILE: Profile = {
  id: 1,
  name: "Your Name",
  headline: "Senior Software Engineer",
  bio: "Add your bio from the admin panel.",
  location: null,
  email: null,
  githubUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  resumeUrl: null,
  avatarUrl: null,
  yearsExperience: 7,
  updatedAt: new Date(),
};

export async function getProfile(): Promise<Profile> {
  const rows = await db.select().from(profile).where(eq(profile.id, 1)).limit(1);
  return rows[0] ?? FALLBACK_PROFILE;
}

export async function getProjects() {
  return db
    .select()
    .from(projects)
    .orderBy(desc(projects.featured), asc(projects.sortOrder), desc(projects.createdAt));
}

export async function getProject(id: number) {
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getExperiences() {
  return db.select().from(experiences).orderBy(asc(experiences.sortOrder));
}

export async function getExperience(id: number) {
  const rows = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getSkills() {
  return db.select().from(skills).orderBy(asc(skills.category), asc(skills.sortOrder));
}

/** Skills bucketed by category, preserving category order. */
export async function getSkillsByCategory() {
  const all = await getSkills();
  const grouped = new Map<string, typeof all>();
  for (const skill of all) {
    const bucket = grouped.get(skill.category) ?? [];
    bucket.push(skill);
    grouped.set(skill.category, bucket);
  }
  return [...grouped.entries()];
}

export async function getMessages() {
  return db.select().from(messages).orderBy(desc(messages.createdAt));
}

export function splitTech(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
