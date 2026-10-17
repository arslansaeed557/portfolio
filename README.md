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

A Postgres container is already running for development:

```bash
docker start portfolio-pg     # if it isn't running
```

`.env.local` points at it (`localhost:5433`). To recreate it from scratch:

```bash
docker run -d --name portfolio-pg \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_PASSWORD=portfolio_dev_pw \
  -e POSTGRES_DB=portfolio_dev \
  -p 5433:5432 postgres:16
```

Then create the tables, seed starter content, and run it:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Site at http://localhost:8004, admin at http://localhost:8004/admin.

To set a different admin password:

```bash
npm run hash-password -- "your-password-here"
```

Paste the printed hash into `ADMIN_PASSWORD_HASH`, **escaping each `$` as
`\$`** — dotenv treats a bare `$` as a variable reference and would mangle the
hash, making every login fail with "Incorrect password". In the Vercel
dashboard, paste the same hash *unescaped*; the app accepts either form.

## Where images are stored

| Environment | Storage | URL |
| --- | --- | --- |
| Local | `public/uploads/` on disk (gitignored) | `/uploads/<file>` |
| Vercel | Vercel Blob | `https://<store>.public.blob.vercel-storage.com/…` |

The upload route picks Blob whenever `BLOB_READ_WRITE_TOKEN` is set, and falls
back to disk otherwise. Vercel's filesystem is read-only, so **a Blob store is
required in production** — without it the upload button returns a clear error
and you can paste an image URL instead.

Images uploaded locally stay on your machine. They won't appear on the
deployed site, so re-upload them there (or paste a public URL).

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project** and import the repo.
3. Under **Storage**, add the **Neon** integration (or paste your existing
   `DATABASE_URL`). Vercel injects the variable automatically. The app uses the
   standard `pg` driver, so a normal Neon connection string works as-is.
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
