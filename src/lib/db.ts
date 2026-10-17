import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let client: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Created on first query rather than at import time, so `next build` and
 * typechecks don't require a live DATABASE_URL.
 */
function getDb(): NeonHttpDatabase<typeof schema> {
  if (client) return client;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  }

  client = drizzle(neon(url), { schema });
  return client;
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});

export { schema };
