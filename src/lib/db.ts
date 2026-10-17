import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let client: NodePgDatabase<typeof schema> | null = null;

/** Neon and other hosted providers need TLS; a local socket/host does not. */
function needsSsl(url: string): boolean {
  if (/sslmode=disable/.test(url)) return false;
  if (/sslmode=require|sslmode=verify/.test(url)) return true;
  return !/@(localhost|127\.0\.0\.1|\[::1\])/.test(url);
}

/**
 * Created on first query rather than at import time, so `next build` and
 * typechecks don't require a live DATABASE_URL.
 *
 * node-postgres speaks to local Postgres and to Neon over the same connection
 * string, so local development and the Vercel deployment run identical code.
 */
function getDb(): NodePgDatabase<typeof schema> {
  if (client) return client;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  }

  const pool = new Pool({
    connectionString: url,
    ssl: needsSsl(url) ? { rejectUnauthorized: false } : undefined,
    max: 3, // serverless functions are short-lived; keep the pool small
  });

  client = drizzle(pool, { schema });
  return client;
}

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});

export { schema };
