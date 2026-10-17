# Portfolio + Admin Panel

Personal portfolio site with a password-protected admin panel for editing every
piece of content — profile, projects, experience, skills — without touching code.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · Neon Postgres ·
Drizzle ORM · Vercel Blob

## Routes

| Route | What it is |
| --- | --- |
| `/` | Public portfolio — hero, about, skills, experience, projects, contact form |
| `/admin` | Dashboard with content counts |
| `/admin/profile` | Name, headline, bio, socials, résumé link, avatar |
| `/admin/projects` | Create / edit / delete projects, with image upload |
| `/admin/experience` | Create / edit / delete roles |
| `/admin/skills` | Add / remove skills, grouped by category |
| `/admin/messages` | Contact form submissions |

Everything under `/admin` is guarded by `src/proxy.ts`, and every write action
re-checks the session server-side before touching the database.

## Local setup

1. **Create a Neon database** at [neon.tech](https://neon.tech) (free tier) and
   copy the connection string.

2. **Fill in `.env.local`:**

   ```
   DATABASE_URL="postgresql://…@….neon.tech/neondb?sslmode=require"
   SESSION_SECRET="…"              # already generated for you
   ADMIN_PASSWORD_HASH=""          # see step 3
   ```

3. **Set your admin password:**

   ```bash
   npm run hash-password -- "your-password-here"
   ```

   Paste the printed hash into `ADMIN_PASSWORD_HASH`, **escaping each `$` as
   `\$`** — dotenv treats a bare `$` as a variable reference and would mangle
   the hash, making every login fail with "Incorrect password". In the Vercel
   dashboard, paste the same hash *unescaped*; the app accepts either form.

4. **Create the tables and seed starter content:**

   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Run it:**

   ```bash
   npm run dev
   ```

   Site at http://localhost:8004, admin at http://localhost:8004/admin.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project** and import the repo.
3. Under **Storage**, add the **Neon** integration (or paste your existing
   `DATABASE_URL`). Vercel injects the variable automatically.
4. Under **Storage**, add **Blob** if you want image uploads. This injects
   `BLOB_READ_WRITE_TOKEN`.
5. Add the remaining environment variables in **Settings → Environment Variables**:
   - `SESSION_SECRET`
   - `ADMIN_PASSWORD_HASH`
6. Deploy. Run `npm run db:push` once against the production database if you
   created a fresh one.

## Notes

- `npm run db:seed` **clears** projects, skills and experiences before
  inserting. Use it for first-run setup, not after you've added real content.
- Image uploads need `BLOB_READ_WRITE_TOKEN`. Without it the upload button
  returns a clear error and you can paste an image URL instead.
- Pages read the database on every request (`force-dynamic`), so admin edits
  appear on the site immediately.
