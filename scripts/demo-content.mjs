#!/usr/bin/env node
/**
 * Replaces all portfolio content with a fuller set of placeholder data.
 *
 * DESTRUCTIVE: clears projects, skills and experiences first. The numbers and
 * company names here are invented — replace them through /admin before
 * sharing the site.
 *
 * Usage:
 *   npm run db:demo                           (local)
 *   DATABASE_URL="<url>" node scripts/demo-content.mjs   (anywhere else)
 */
import pg from "pg";

const PROFILE = {
  name: "Arslan Saeed",
  headline: "Senior Software Engineer — scalable backends & production AI",
  bio: "I build backend systems that stay calm under load. Seven years across Ruby on Rails, Node.js and Python, mostly on products where traffic grew faster than the architecture was designed for — and where someone had to fix that without downtime. Lately I spend most of my time on retrieval and LLM systems that have to survive real users, not just a demo.",
  location: "Lahore, Pakistan · Remote",
  email: "arslan@codingcops.com",
  phone: "+92 300 0000000",
  github_url: "https://github.com/arslansaeed557",
  linkedin_url: "https://linkedin.com/in/arslansaeed",
  years_experience: 7,
};

const SKILLS = [
  ["Ruby on Rails", "Backend", 1], ["Node.js", "Backend", 2], ["Python", "Backend", 3],
  ["FastAPI", "Backend", 4], ["GraphQL", "Backend", 5], ["REST API design", "Backend", 6],
  ["Sidekiq", "Backend", 7], ["Background jobs", "Backend", 8],

  ["RAG pipelines", "AI & LLM", 1], ["Vector search", "AI & LLM", 2],
  ["Embeddings", "AI & LLM", 3], ["Prompt evaluation", "AI & LLM", 4],
  ["LLM cost control", "AI & LLM", 5], ["Semantic chunking", "AI & LLM", 6],

  ["PostgreSQL", "Data", 1], ["MySQL", "Data", 2], ["Redis", "Data", 3],
  ["pgvector", "Data", 4], ["Query optimisation", "Data", 5], ["Data modelling", "Data", 6],

  ["AWS", "Infrastructure", 1], ["Docker", "Infrastructure", 2], ["Terraform", "Infrastructure", 3],
  ["CI/CD", "Infrastructure", 4], ["Observability", "Infrastructure", 5], ["Kubernetes", "Infrastructure", 6],

  ["TypeScript", "Frontend", 1], ["React", "Frontend", 2], ["Next.js", "Frontend", 3],
  ["Tailwind CSS", "Frontend", 4],
];

const EXPERIENCES = [
  {
    role: "Senior Software Engineer",
    company: "CodingCops",
    location: "Remote",
    start_date: "2022",
    end_date: null,
    description:
      "Technical lead on two customer-facing SaaS products, owning the backend from schema to deploy.\nCut p95 API latency from 1.8s to 240ms by reshaping the hottest queries and adding a read-through cache layer.\nDesigned and shipped a RAG pipeline over customer documents, including the evaluation harness that keeps answer quality from regressing.\nIntroduced the CI quality gates — tests, linting, type checks — that took production incidents from weekly to rare.\nMentor three engineers through design review and pairing.",
    tech_stack: "Ruby on Rails, Node.js, Python, PostgreSQL, Redis, AWS, Docker",
    sort_order: 1,
  },
  {
    role: "Software Engineer",
    company: "Northwind Labs",
    location: "Lahore, Pakistan",
    start_date: "2020",
    end_date: "2022",
    description:
      "Built and operated a multi-tenant Rails platform serving roughly 40k daily active users.\nBroke a seven-year-old monolith into clearly bounded services without a big-bang rewrite or customer-visible downtime.\nReplaced nightly batch reporting with an event-driven pipeline, dropping report freshness from 24 hours to under a minute.\nOwned the on-call rotation and the postmortem process.",
    tech_stack: "Ruby on Rails, Sidekiq, PostgreSQL, RabbitMQ, AWS",
    sort_order: 2,
  },
  {
    role: "Backend Engineer",
    company: "Meridian Software",
    location: "Lahore, Pakistan",
    start_date: "2019",
    end_date: "2020",
    description:
      "Delivered REST APIs and internal tooling for logistics clients.\nBuilt the reconciliation service that caught pricing mismatches worth six figures annually.\nAutomated a deployment process that had been manual, cutting release time from hours to minutes.",
    tech_stack: "Node.js, Express, MySQL, Docker",
    sort_order: 3,
  },
];

const PROJECTS = [
  {
    title: "Atlas — RAG Document Assistant",
    summary:
      "Retrieval-augmented assistant over a private document corpus. Semantic chunking, hybrid search and a re-ranking pass, with an evaluation harness that scores every change before it ships.",
    description:
      "Built to answer questions over tens of thousands of internal documents without hallucinating. The interesting problem was not retrieval — it was knowing when quality regressed. A golden-set evaluation runs on every prompt or model change and blocks the deploy if scores drop.",
    tech_stack: "Python, FastAPI, pgvector, OpenAI, Redis",
    featured: true,
    sort_order: 1,
  },
  {
    title: "Multi-tenant Rails API Platform",
    summary:
      "The backend behind a B2B SaaS product: tenant isolation, background processing, rate limiting and caching that kept p95 latency flat while traffic grew 8×.",
    description:
      "Row-level tenant scoping enforced at the query layer rather than trusted to application code, so a missing filter fails loudly in tests instead of leaking data in production.",
    tech_stack: "Ruby on Rails, PostgreSQL, Redis, Sidekiq, AWS",
    featured: true,
    sort_order: 2,
  },
  {
    title: "Realtime Events Gateway",
    summary:
      "Node.js gateway handling live updates and third-party webhooks, with queue-backed retries, idempotency keys and end-to-end tracing.",
    tech_stack: "Node.js, TypeScript, WebSockets, RabbitMQ",
    featured: false,
    sort_order: 3,
  },
  {
    title: "Ledger Reconciliation Service",
    summary:
      "Python service reconciling millions of transactions a day across three payment providers, flagging mismatches before they reached finance.",
    tech_stack: "Python, Celery, PostgreSQL, Airflow",
    featured: false,
    sort_order: 4,
  },
  {
    title: "Observability Starter Kit",
    summary:
      "Opinionated tracing, metrics and structured logging setup dropped into new Rails and Node services, so a service is debuggable the day it ships.",
    tech_stack: "OpenTelemetry, Grafana, Prometheus, Terraform",
    featured: false,
    sort_order: 5,
  },
  {
    title: "Schema Migration Toolkit",
    summary:
      "Zero-downtime migration helpers for large Postgres tables — backfills, dual writes and safe column drops, with a dry-run mode that shows the lock profile first.",
    tech_stack: "Ruby, PostgreSQL, Rails",
    featured: false,
    sort_order: 6,
  },
];

/** Replaces all content using an already-connected pg client. */
export async function applyDemoContent(client) {
  console.log("Replacing portfolio content…");

  await client.query("DELETE FROM skills");
  await client.query("DELETE FROM experiences");
  await client.query("DELETE FROM projects");

  await client.query(
    `INSERT INTO profile (id, name, headline, bio, location, email, phone, github_url, linkedin_url, years_experience)
     VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (id) DO UPDATE SET
       name=EXCLUDED.name, headline=EXCLUDED.headline, bio=EXCLUDED.bio,
       location=EXCLUDED.location, email=EXCLUDED.email, phone=EXCLUDED.phone, github_url=EXCLUDED.github_url,
       linkedin_url=EXCLUDED.linkedin_url, years_experience=EXCLUDED.years_experience`,
    [PROFILE.name, PROFILE.headline, PROFILE.bio, PROFILE.location, PROFILE.email,
     PROFILE.phone, PROFILE.github_url, PROFILE.linkedin_url, PROFILE.years_experience],
  );

  for (const [name, category, order] of SKILLS) {
    await client.query(
      "INSERT INTO skills (name, category, sort_order) VALUES ($1,$2,$3)",
      [name, category, order],
    );
  }

  for (const j of EXPERIENCES) {
    await client.query(
      `INSERT INTO experiences (role, company, location, start_date, end_date, description, tech_stack, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [j.role, j.company, j.location, j.start_date, j.end_date, j.description, j.tech_stack, j.sort_order],
    );
  }

  for (const p of PROJECTS) {
    await client.query(
      `INSERT INTO projects (title, summary, description, tech_stack, featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [p.title, p.summary, p.description ?? null, p.tech_stack, p.featured, p.sort_order],
    );
  }

  console.log(
    `Done: ${SKILLS.length} skills, ${EXPERIENCES.length} roles, ${PROJECTS.length} projects.`,
  );
}

/** Standalone: node scripts/demo-content.mjs */
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const useSsl =
    !/sslmode=disable/.test(url) && !/@(localhost|127\.0\.0\.1|\[::1\])/.test(url);

  const client = new pg.Client({
    connectionString: url,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();
  await applyDemoContent(client);
  await client.end();
}
