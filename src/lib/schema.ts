import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** Single-row table holding the site owner's identity and hero copy. */
export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  location: text("location"),
  email: text("email"),
  phone: text("phone"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  resumeUrl: text("resume_url"),
  avatarUrl: text("avatar_url"),
  /** YouTube/Vimeo/Loom link, or a direct video file URL. */
  introVideoUrl: text("intro_video_url"),
  /** Optional still shown before the intro video is played. */
  introVideoPoster: text("intro_video_poster"),
  yearsExperience: integer("years_experience").default(7),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description"),
  /** Comma-separated tech tags, e.g. "Rails,Postgres,Sidekiq". */
  techStack: text("tech_stack").notNull().default(""),
  imageUrl: text("image_url"),
  repoUrl: text("repo_url"),
  liveUrl: text("live_url"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  /** Free text so "Jan 2023" and "2023" both work. */
  startDate: text("start_date").notNull(),
  /** Null means "Present". */
  endDate: text("end_date"),
  description: text("description"),
  techStack: text("tech_stack").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  /** Groups the skill on the public page, e.g. "Backend", "AI & Data". */
  category: text("category").notNull().default("Other"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Profile = typeof profile.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Message = typeof messages.$inferSelect;
