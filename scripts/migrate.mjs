#!/usr/bin/env node
/**
 * Applies pending migrations, then inserts starter content only if the
 * database is still empty. Runs during the Vercel build, where DATABASE_URL
 * is available but cannot be read back out of the dashboard.
 *
 * Unlike scripts/seed.mjs this never deletes anything, so it is safe to run
 * on every deploy.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const url = process.env.DATABASE_URL;

if (!url) {
  console.log("[migrate] DATABASE_URL not set — skipping migrations.");
  process.exit(0);
}

const useSsl =
  !/sslmode=disable/.test(url) && !/@(localhost|127\.0\.0\.1|\[::1\])/.test(url);

const pool = new pg.Pool({
  connectionString: url,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  max: 1,
});

const db = drizzle(pool);

console.log("[migrate] applying migrations…");
await migrate(db, { migrationsFolder: "./drizzle" });
console.log("[migrate] schema up to date.");

const { rows } = await pool.query("select count(*)::int as count from profile");

if (rows[0].count === 0) {
  console.log("[migrate] empty database — inserting starter content.");

  await pool.query(
    `insert into profile (id, name, headline, bio, location, email, years_experience)
     values (1, $1, $2, $3, $4, $5, $6)
     on conflict (id) do nothing`,
    [
      "Arslan Saeed",
      "Senior Software Engineer · Scalable Backends & AI Systems",
      "Senior software engineer with 7+ years building production systems across Ruby on Rails, Node.js and Python. I design services that stay fast and predictable as traffic grows, and I build AI features — RAG pipelines, retrieval and evaluation — that hold up outside a demo.",
      "Pakistan",
      "arslan@codingcops.com",
      7,
    ],
  );

  const skills = [
    ["Ruby on Rails", "Backend", 1], ["Node.js", "Backend", 2], ["Python", "Backend", 3],
    ["GraphQL", "Backend", 4], ["REST API design", "Backend", 5],
    ["RAG pipelines", "AI & Data", 1], ["Vector search", "AI & Data", 2],
    ["LLM integration", "AI & Data", 3], ["Embeddings", "AI & Data", 4],
    ["PostgreSQL", "Data", 1], ["Redis", "Data", 2], ["Query optimisation", "Data", 3],
    ["AWS", "Infrastructure", 1], ["Docker", "Infrastructure", 2], ["CI/CD", "Infrastructure", 3],
    ["TypeScript", "Frontend", 1], ["React", "Frontend", 2], ["Next.js", "Frontend", 3],
  ];
  for (const [name, category, order] of skills) {
    await pool.query(
      "insert into skills (name, category, sort_order) values ($1,$2,$3)",
      [name, category, order],
    );
  }

  await pool.query(
    `insert into experiences (role, company, location, start_date, end_date, description, tech_stack, sort_order)
     values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      "Senior Software Engineer",
      "CodingCops",
      "Remote",
      "2022",
      null,
      "Lead backend work on customer-facing SaaS products.\nDesigned and scaled Rails and Node services handling growing production traffic.\nBuilt AI features including a RAG pipeline over customer documents.\nMentored engineers through design review and pairing.",
      "Ruby on Rails, Node.js, Python, PostgreSQL, Redis, AWS",
      1,
    ],
  );

  const projects = [
    [
      "RAG Document Assistant",
      "Retrieval-augmented chat over a private document corpus, with chunking, embedding, re-ranking and an evaluation harness to catch regressions in answer quality.",
      "Python, LLM APIs, pgvector, FastAPI",
      true,
      1,
    ],
    [
      "Scalable Rails API Platform",
      "Multi-tenant Rails API serving a SaaS product, with background processing, caching and rate limiting that kept p95 latency flat as traffic multiplied.",
      "Ruby on Rails, PostgreSQL, Redis, Sidekiq, AWS",
      true,
      2,
    ],
  ];
  for (const [title, summary, tech, featured, order] of projects) {
    await pool.query(
      "insert into projects (title, summary, tech_stack, featured, sort_order) values ($1,$2,$3,$4,$5)",
      [title, summary, tech, featured, order],
    );
  }

  console.log("[migrate] starter content inserted.");
} else {
  console.log("[migrate] content already present — leaving it alone.");
}

await pool.end();
