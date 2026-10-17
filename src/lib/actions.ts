"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { experiences, messages, profile, projects, skills } from "./schema";
import { endSession, isAuthenticated, startSession } from "./auth";

/** Every write below goes through this first. Middleware guards the UI; this guards the data. */
async function requireAdmin() {
  if (!(await isAuthenticated())) {
    throw new Error("Not authorised");
  }
}

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function optional(form: FormData, key: string): string | null {
  const value = str(form, key);
  return value === "" ? null : value;
}

function num(form: FormData, key: string, fallback = 0): number {
  const parsed = Number(str(form, key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function refreshSite() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

/* ---------------------------------------------------------------- auth --- */

/**
 * Bcrypt hashes contain `$`, which dotenv expands as a variable reference, so
 * `.env.local` has to escape them as `\$`. Vercel stores values literally and
 * needs the unescaped form. Accept either by unescaping here.
 */
function adminHash(): string | undefined {
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!raw) return undefined;
  return raw.replace(/\\\$/g, "$");
}

export async function login(_prev: unknown, form: FormData) {
  const password = str(form, "password");
  const hash = adminHash();

  if (!hash) {
    return { error: "ADMIN_PASSWORD_HASH is not set on the server." };
  }
  if (!password) {
    return { error: "Enter your password." };
  }
  if (!(await bcrypt.compare(password, hash))) {
    return { error: "Incorrect password." };
  }

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------- profile --- */

export async function saveProfile(form: FormData) {
  await requireAdmin();

  const values = {
    name: str(form, "name"),
    headline: str(form, "headline"),
    bio: str(form, "bio"),
    location: optional(form, "location"),
    email: optional(form, "email"),
    githubUrl: optional(form, "githubUrl"),
    linkedinUrl: optional(form, "linkedinUrl"),
    twitterUrl: optional(form, "twitterUrl"),
    resumeUrl: optional(form, "resumeUrl"),
    avatarUrl: optional(form, "avatarUrl"),
    yearsExperience: num(form, "yearsExperience", 7),
    updatedAt: new Date(),
  };

  await db
    .insert(profile)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({ target: profile.id, set: values });

  refreshSite();
  redirect("/admin/profile?saved=1");
}

/* ------------------------------------------------------------ projects --- */

export async function saveProject(form: FormData) {
  await requireAdmin();

  const id = num(form, "id", 0);
  const values = {
    title: str(form, "title"),
    summary: str(form, "summary"),
    description: optional(form, "description"),
    techStack: str(form, "techStack"),
    imageUrl: optional(form, "imageUrl"),
    repoUrl: optional(form, "repoUrl"),
    liveUrl: optional(form, "liveUrl"),
    featured: form.get("featured") === "on",
    sortOrder: num(form, "sortOrder", 0),
  };

  if (id > 0) {
    await db.update(projects).set(values).where(eq(projects.id, id));
  } else {
    await db.insert(projects).values(values);
  }

  refreshSite();
  redirect("/admin/projects");
}

export async function deleteProject(form: FormData) {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, num(form, "id")));
  refreshSite();
  redirect("/admin/projects");
}

/* ---------------------------------------------------------- experience --- */

export async function saveExperience(form: FormData) {
  await requireAdmin();

  const id = num(form, "id", 0);
  const values = {
    role: str(form, "role"),
    company: str(form, "company"),
    location: optional(form, "location"),
    startDate: str(form, "startDate"),
    endDate: optional(form, "endDate"),
    description: optional(form, "description"),
    techStack: str(form, "techStack"),
    sortOrder: num(form, "sortOrder", 0),
  };

  if (id > 0) {
    await db.update(experiences).set(values).where(eq(experiences.id, id));
  } else {
    await db.insert(experiences).values(values);
  }

  refreshSite();
  redirect("/admin/experience");
}

export async function deleteExperience(form: FormData) {
  await requireAdmin();
  await db.delete(experiences).where(eq(experiences.id, num(form, "id")));
  refreshSite();
  redirect("/admin/experience");
}

/* -------------------------------------------------------------- skills --- */

export async function createSkill(form: FormData) {
  await requireAdmin();
  const name = str(form, "name");
  if (!name) redirect("/admin/skills");

  await db.insert(skills).values({
    name,
    category: str(form, "category") || "Other",
    sortOrder: num(form, "sortOrder", 0),
  });

  refreshSite();
  redirect("/admin/skills");
}

export async function deleteSkill(form: FormData) {
  await requireAdmin();
  await db.delete(skills).where(eq(skills.id, num(form, "id")));
  refreshSite();
  redirect("/admin/skills");
}

/* ------------------------------------------------------------ messages --- */

/** Public — called by the contact form on the landing page. */
export async function sendMessage(_prev: unknown, form: FormData) {
  const name = str(form, "name");
  const email = str(form, "email");
  const body = str(form, "body");

  if (!name || !email || !body) {
    return { error: "All fields are required.", sent: false };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That email address doesn't look right.", sent: false };
  }

  await db.insert(messages).values({ name, email, body });
  return { error: null, sent: true };
}

export async function markMessageRead(form: FormData) {
  await requireAdmin();
  await db
    .update(messages)
    .set({ read: true })
    .where(eq(messages.id, num(form, "id")));
  revalidatePath("/admin/messages");
}

export async function deleteMessage(form: FormData) {
  await requireAdmin();
  await db.delete(messages).where(eq(messages.id, num(form, "id")));
  revalidatePath("/admin/messages");
}
