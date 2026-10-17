import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let client: NodePgDatabase<typeof schema> | null = null;

/**
 * Neon and other hosted providers need TLS; a local socket/host does not.
 *
 * sslmode is stripped from the URL and TLS configured explicitly: pg warns on
 * every connection that it currently coerces sslmode=require to verify-full
 * and will change that in a future major version.
 */
function sslSettings(url: string): { url: string; ssl?: { rejectUnauthorized: boolean } } {
  if (/sslmode=disable/.test(url)) return { url };
  if (/@(localhost|127\.0\.0\.1|\[::1\])/.test(url)) return { url };

  const cleaned = url.replace(/([?&])sslmode=[^&]*&?/g, "$1").replace(/[?&]$/, "");

  // Verify the server certificate against the system CA store.
  return { url: cleaned, ssl: { rejectUnauthorized: true } };
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

  const { url: connectionString, ssl } = sslSettings(url);

  const pool = new Pool({
    connectionString,
    ssl,
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
