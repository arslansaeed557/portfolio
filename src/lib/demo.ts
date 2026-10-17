import "server-only";
import type { Experience, Profile, Project, Skill } from "./schema";

/**
 * Used only when DATABASE_URL is unset, so the site renders before Neon is
 * connected. Mirrors scripts/seed.mjs — once the database is live this is
 * never read.
 */
export const dbConfigured = () => Boolean(process.env.DATABASE_URL);

export const DEMO_PROFILE: Profile = {
  id: 1,
  name: "Arslan Saeed",
  headline: "Senior Software Engineer · Scalable Backends & AI Systems",
  bio: "Senior software engineer with 7+ years building production systems across Ruby on Rails, Node.js and Python. I design services that stay fast and predictable as traffic grows, and I build AI features — RAG pipelines, retrieval and evaluation — that hold up outside a demo.",
  location: "Pakistan",
  email: "arslan@codingcops.com",
  phone: "+92 300 0000000",
  githubUrl: "https://github.com/",
  linkedinUrl: "https://linkedin.com/in/",
  twitterUrl: null,
  resumeUrl: null,
  avatarUrl: null,
  yearsExperience: 7,
  updatedAt: new Date(),
};

const skill = (id: number, name: string, category: string, sortOrder: number): Skill => ({
  id,
  name,
  category,
  sortOrder,
});

export const DEMO_SKILLS: Skill[] = [
  skill(1, "Ruby on Rails", "Backend", 1),
  skill(2, "Node.js", "Backend", 2),
  skill(3, "Python", "Backend", 3),
  skill(4, "GraphQL", "Backend", 4),
  skill(5, "REST API design", "Backend", 5),
  skill(6, "RAG pipelines", "AI & Data", 1),
  skill(7, "Vector search", "AI & Data", 2),
  skill(8, "LLM integration", "AI & Data", 3),
  skill(9, "Embeddings", "AI & Data", 4),
  skill(10, "PostgreSQL", "Data", 1),
  skill(11, "Redis", "Data", 2),
  skill(12, "Query optimisation", "Data", 3),
  skill(13, "AWS", "Infrastructure", 1),
  skill(14, "Docker", "Infrastructure", 2),
  skill(15, "CI/CD", "Infrastructure", 3),
  skill(16, "TypeScript", "Frontend", 1),
  skill(17, "React", "Frontend", 2),
  skill(18, "Next.js", "Frontend", 3),
];

export const DEMO_EXPERIENCES: Experience[] = [
  {
    id: 1,
    role: "Senior Software Engineer",
    company: "CodingCops",
    location: "Remote",
    startDate: "2022",
    endDate: null,
    description:
      "Lead backend work on customer-facing SaaS products.\nDesigned and scaled Rails and Node services handling growing production traffic.\nBuilt AI features including a RAG pipeline over customer documents.\nMentored engineers through design review and pairing.",
    techStack: "Ruby on Rails, Node.js, Python, PostgreSQL, Redis, AWS",
    sortOrder: 1,
  },
  {
    id: 2,
    role: "Software Engineer",
    company: "Previous Company",
    location: "Lahore, Pakistan",
    startDate: "2019",
    endDate: "2022",
    description:
      "Built and operated high-traffic web applications.\nRefactored legacy modules into cleanly layered services.\nImproved API response times through query and cache optimisation.",
    techStack: "Ruby on Rails, JavaScript, MySQL, Docker",
    sortOrder: 2,
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 1,
    title: "RAG Document Assistant",
    summary:
      "Retrieval-augmented chat over a private document corpus, with chunking, embedding, re-ranking and an evaluation harness to catch regressions in answer quality.",
    description: null,
    techStack: "Python, LLM APIs, pgvector, FastAPI",
    imageUrl: null,
    repoUrl: null,
    liveUrl: null,
    featured: true,
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Scalable Rails API Platform",
    summary:
      "Multi-tenant Rails API serving a SaaS product, with background processing, caching and rate limiting that kept p95 latency flat as traffic multiplied.",
    description: null,
    techStack: "Ruby on Rails, PostgreSQL, Redis, Sidekiq, AWS",
    imageUrl: null,
    repoUrl: null,
    liveUrl: null,
    featured: true,
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Realtime Node Services",
    summary:
      "Event-driven Node.js services handling realtime updates and third-party integrations, with queue-backed retries and end-to-end tracing.",
    description: null,
    techStack: "Node.js, TypeScript, WebSockets, Docker",
    imageUrl: null,
    repoUrl: null,
    liveUrl: null,
    featured: false,
    sortOrder: 3,
    createdAt: new Date(),
  },
];
