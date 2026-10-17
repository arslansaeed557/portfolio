#!/usr/bin/env node
/**
 * Seeds starter content. Safe to re-run: it clears the content tables first.
 * Usage: npm run db:seed
 */
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const url = process.env.DATABASE_URL;
const useSsl = !/sslmode=disable/.test(url) && !/@(localhost|127\.0\.0\.1|\[::1\])/.test(url);

const client = new pg.Client({
  connectionString: url,
  ssl: useSsl ? { rejectUnauthorized: true } : undefined,
});
await client.connect();

/** Tagged-template helper so the statements below read like SQL. */
const sql = (strings, ...values) => {
  const text = strings.reduce((acc, part, i) => acc + part + (i < values.length ? `$${i + 1}` : ""), "");
  return client.query(text, values);
};

const PROFILE = {
  name: "Arslan Saeed",
  headline: "Senior Software Engineer · Scalable Backends & AI Systems",
  bio: "Senior software engineer with 7+ years building production systems across Ruby on Rails, Node.js and Python. I design services that stay fast and predictable as traffic grows, and I build AI features — RAG pipelines, retrieval and evaluation — that hold up outside a demo.",
  location: "Pakistan",
  email: "arslan@codingcops.com",
  github_url: "https://github.com/",
  linkedin_url: "https://linkedin.com/in/",
  years_experience: 7,
};

const SKILLS = [
  ["Ruby on Rails", "Backend", 1], ["Node.js", "Backend", 2], ["Python", "Backend", 3],
  ["GraphQL", "Backend", 4], ["REST API design", "Backend", 5], ["Sidekiq / background jobs", "Backend", 6],
  ["RAG pipelines", "AI & Data", 1], ["Vector search", "AI & Data", 2], ["LLM integration", "AI & Data", 3],
  ["Embeddings", "AI & Data", 4], ["Prompt evaluation", "AI & Data", 5],
  ["PostgreSQL", "Data", 1], ["MySQL", "Data", 2], ["Redis", "Data", 3], ["Query optimisation", "Data", 4],
  ["AWS", "Infrastructure", 1], ["Docker", "Infrastructure", 2], ["CI/CD", "Infrastructure", 3],
  ["Terraform", "Infrastructure", 4], ["Observability", "Infrastructure", 5],
  ["TypeScript", "Frontend", 1], ["React", "Frontend", 2], ["Next.js", "Frontend", 3],
];

const EXPERIENCES = [
  {
    role: "Senior Software Engineer",
    company: "CodingCops",
    location: "Remote",
    start_date: "2022",
    end_date: null,
    description:
      "Lead backend work on customer-facing SaaS products.\nDesigned and scaled Rails and Node services handling growing production traffic.\nBuilt AI features including a RAG pipeline over customer documents.\nMentored engineers through design review and pairing.",
    tech_stack: "Ruby on Rails, Node.js, Python, PostgreSQL, Redis, AWS",
    sort_order: 1,
  },
  {
    role: "Software Engineer",
    company: "Previous Company",
    location: "Lahore, Pakistan",
    start_date: "2019",
    end_date: "2022",
    description:
      "Built and operated high-traffic web applications.\nRefactored legacy modules into cleanly layered services.\nImproved API response times through query and cache optimisation.",
    tech_stack: "Ruby on Rails, JavaScript, MySQL, Docker",
    sort_order: 2,
  },
];

const PROJECTS = [
  {
    title: "RAG Document Assistant",
    summary:
      "Retrieval-augmented chat over a private document corpus, with chunking, embedding, re-ranking and an evaluation harness to catch regressions in answer quality.",
    tech_stack: "Python, LLM APIs, pgvector, FastAPI",
    featured: true,
    sort_order: 1,
  },
  {
    title: "Scalable Rails API Platform",
    summary:
      "Multi-tenant Rails API serving a SaaS product, with background processing, caching and rate limiting that kept p95 latency flat as traffic multiplied.",
    tech_stack: "Ruby on Rails, PostgreSQL, Redis, Sidekiq, AWS",
    featured: true,
    sort_order: 2,
  },
  {
    title: "Realtime Node Services",
    summary:
      "Event-driven Node.js services handling realtime updates and third-party integrations, with queue-backed retries and end-to-end tracing.",
    tech_stack: "Node.js, TypeScript, WebSockets, Docker",
    featured: false,
    sort_order: 3,
  },
];

console.log("Seeding…");

await sql`DELETE FROM skills`;
await sql`DELETE FROM experiences`;
await sql`DELETE FROM projects`;

await sql`
  INSERT INTO profile (id, name, headline, bio, location, email, github_url, linkedin_url, years_experience)
  VALUES (1, ${PROFILE.name}, ${PROFILE.headline}, ${PROFILE.bio}, ${PROFILE.location},
          ${PROFILE.email}, ${PROFILE.github_url}, ${PROFILE.linkedin_url}, ${PROFILE.years_experience})
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, headline = EXCLUDED.headline, bio = EXCLUDED.bio,
    location = EXCLUDED.location, email = EXCLUDED.email, github_url = EXCLUDED.github_url,
    linkedin_url = EXCLUDED.linkedin_url, years_experience = EXCLUDED.years_experience
`;

for (const [name, category, order] of SKILLS) {
  await sql`INSERT INTO skills (name, category, sort_order) VALUES (${name}, ${category}, ${order})`;
}

for (const job of EXPERIENCES) {
  await sql`
    INSERT INTO experiences (role, company, location, start_date, end_date, description, tech_stack, sort_order)
    VALUES (${job.role}, ${job.company}, ${job.location}, ${job.start_date}, ${job.end_date},
            ${job.description}, ${job.tech_stack}, ${job.sort_order})
  `;
}

for (const project of PROJECTS) {
  await sql`
    INSERT INTO projects (title, summary, tech_stack, featured, sort_order)
    VALUES (${project.title}, ${project.summary}, ${project.tech_stack}, ${project.featured}, ${project.sort_order})
  `;
}

console.log(`Seeded ${SKILLS.length} skills, ${EXPERIENCES.length} roles, ${PROJECTS.length} projects.`);
await client.end();
