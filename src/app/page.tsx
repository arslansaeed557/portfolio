import {
  ArrowUpRight,
  Brain,
  Gauge,
  Mail,
  MapPin,
  Phone,
  Server,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { ContactForm } from "@/components/ContactForm";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/BrandIcons";
import {
  getExperiences,
  getProfile,
  getProjects,
  getSkillsByCategory,
  splitTech,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Placeholder figures — edit these once there are real numbers to quote. */
const STATS = [
  { value: "7+", label: "Years building backends" },
  { value: "8×", label: "Traffic growth absorbed" },
  { value: "240ms", label: "p95 after tuning" },
  { value: "40k", label: "Daily active users served" },
];

const FOCUS = [
  {
    Icon: Server,
    title: "Scalable backends",
    body: "Rails and Node services with clear domain boundaries, queue-backed work and caching that holds up when traffic multiplies rather than doubles.",
  },
  {
    Icon: Brain,
    title: "Production AI",
    body: "RAG pipelines, retrieval tuning and evaluation harnesses — the parts that decide whether an LLM feature survives contact with real users.",
  },
  {
    Icon: Gauge,
    title: "Performance & reliability",
    body: "Query and cache work, zero-downtime migrations, and the tracing and alerting that make a 3am page solvable instead of guesswork.",
  },
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

function SectionHeading({
  label,
  title,
  blurb,
}: {
  label: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="rule font-mono text-xs uppercase tracking-[0.22em] text-accent">{label}</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {blurb ? <p className="mt-3 leading-relaxed text-muted">{blurb}</p> : null}
    </div>
  );
}

export default async function Home() {
  const [profile, projects, experiences, skillGroups] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperiences(),
    getSkillsByCategory(),
  ]);

  const socials = [
    { href: profile.githubUrl, label: "GitHub", Icon: GithubIcon },
    { href: profile.linkedinUrl, label: "LinkedIn", Icon: LinkedinIcon },
    { href: profile.twitterUrl, label: "X", Icon: XIcon },
    { href: profile.email ? `mailto:${profile.email}` : null, label: "Email", Icon: Mail },
  ].filter((item): item is { href: string; label: string; Icon: typeof GithubIcon } =>
    Boolean(item.href),
  );

  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <>
      <Nav name={profile.name} />

      <main className="flex-1">
        {/* ------------------------------------------------------------ hero */}
        <section className="hero-glow relative overflow-hidden">
          <div className="grid-bg absolute inset-0" />

          <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 sm:pt-32">
            <p
              className="rise mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur"
              style={{ "--delay": "0ms" } as React.CSSProperties}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Open to senior backend &amp; AI roles
            </p>

            <div
              className="rise flex flex-col gap-6 sm:flex-row sm:items-center"
              style={{ "--delay": "80ms" } as React.CSSProperties}
            >
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-20 w-20 shrink-0 rounded-2xl border border-border object-cover sm:h-28 sm:w-28"
                />
              ) : null}

              <h1 className="gradient-text max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
                {profile.name}
              </h1>
            </div>

            <p
              className="rise mt-6 max-w-2xl text-lg font-medium text-accent sm:text-xl"
              style={{ "--delay": "140ms" } as React.CSSProperties}
            >
              {profile.headline}
            </p>

            <p
              className="rise mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
              style={{ "--delay": "200ms" } as React.CSSProperties}
            >
              {profile.bio}
            </p>

            <div
              className="rise mt-9 flex flex-wrap items-center gap-3"
              style={{ "--delay": "260ms" } as React.CSSProperties}
            >
              <a
                href="#contact"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-bg shadow-lg shadow-accent/10 transition hover:bg-accent-dim"
              >
                Get in touch
              </a>
              <a
                href="#projects"
                className="rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium transition hover:border-accent/40 hover:text-accent"
              >
                See the work
              </a>
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-3 text-sm text-muted transition hover:text-accent"
                >
                  Résumé <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}

              <div className="flex items-center gap-1 sm:ml-1">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:border-accent/40 hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div
              className="rise mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted"
              style={{ "--delay": "320ms" } as React.CSSProperties}
            >
              {profile.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </span>
              ) : null}
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 transition hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" /> {profile.email}
                </a>
              ) : null}
              {profile.phone ? (
                <a
                  href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center gap-1.5 transition hover:text-accent"
                >
                  <Phone className="h-3.5 w-3.5" /> {profile.phone}
                </a>
              ) : null}
            </div>

            {/* stat strip */}
            <dl
              className="rise mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4"
              style={{ "--delay": "380ms" } as React.CSSProperties}
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-surface px-5 py-6">
                  <dt className="text-2xl font-semibold tabular-nums text-accent sm:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ----------------------------------------------------------- focus */}
        <section id="about" className="border-t border-border/60 bg-surface/20">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <SectionHeading
              label="What I do"
              title="Three things I'm reliably good at"
              blurb="Most of my work sits where product pressure meets systems that were not designed for it."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {FOCUS.map(({ Icon, title, body }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition group-hover:bg-accent/15">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </article>
              ))}
            </div>

            {skillGroups.length > 0 ? (
              <div className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {skillGroups.map(([category, items]) => (
                  <div key={category}>
                    <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-accent/80">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-lg border border-border bg-surface px-2.5 py-1 text-sm text-text/90 transition hover:border-accent/30"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* -------------------------------------------------------- projects */}
        {projects.length > 0 ? (
          <section id="projects" className="border-t border-border/60">
            <div className="mx-auto max-w-5xl px-6 py-24">
              <SectionHeading
                label="Projects"
                title="Selected work"
                blurb="A few systems worth describing in more detail than a bullet point."
              />

              {/* featured projects get the wide treatment, with full write-up */}
              <div className="mb-5 space-y-5">
                {featured.map((project, index) => (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent/40"
                  >
                    <div className="grid md:grid-cols-2">
                      <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                        {project.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <div className="flex h-56 w-full items-center justify-center bg-surface-2 p-8 md:h-full">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="hero-glow relative hidden h-full min-h-56 overflow-hidden bg-surface-2 md:block">
                            <div className="grid-bg absolute inset-0" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col p-7">
                        <span className="mb-3 w-fit rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                          Featured
                        </span>
                        <h3 className="text-xl font-medium">{project.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>

                        {project.description ? (
                          <ul className="mt-4 space-y-2">
                            {project.description
                              .split("\n")
                              .map((line) => line.replace(/^[-•*]\s*/, "").trim())
                              .filter(Boolean)
                              .map((point) => (
                                <li
                                  key={point}
                                  className="flex gap-2.5 text-sm leading-relaxed text-muted"
                                >
                                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                                  {point}
                                </li>
                              ))}
                          </ul>
                        ) : null}

                        {splitTech(project.techStack).length > 0 ? (
                          <div className="mt-5 flex flex-wrap gap-1.5">
                            {splitTech(project.techStack).map((tech) => (
                              <Tag key={tech}>{tech}</Tag>
                            ))}
                          </div>
                        ) : null}

                        {project.liveUrl || project.repoUrl ? (
                          <div className="mt-6 flex items-center gap-4 border-t border-border/60 pt-5">
                            {project.liveUrl ? (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                              >
                                Live <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            ) : null}
                            {project.repoUrl ? (
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
                              >
                                <GithubIcon className="h-3.5 w-3.5" /> Code
                              </a>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {rest.map((project) => (
                  <article
                    key={project.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent/40"
                  >
                    {project.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <div className="flex h-44 w-full items-center justify-center bg-surface-2 p-6">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-medium transition group-hover:text-accent">
                          {project.title}
                        </h3>
                        {project.featured ? (
                          <span className="shrink-0 rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                            Featured
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                        {project.summary}
                      </p>

                      {splitTech(project.techStack).length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {splitTech(project.techStack).map((tech) => (
                            <Tag key={tech}>{tech}</Tag>
                          ))}
                        </div>
                      ) : null}

                      {project.repoUrl || project.liveUrl ? (
                        <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-4">
                          {project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                            >
                              Live <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          ) : null}
                          {project.repoUrl ? (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
                            >
                              <GithubIcon className="h-3.5 w-3.5" /> Code
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ------------------------------------------------------ experience */}
        {experiences.length > 0 ? (
          <section id="experience" className="border-t border-border/60 bg-surface/20">
            <div className="mx-auto max-w-5xl px-6 py-24">
              <SectionHeading label="Experience" title="Where I've worked" />

              <ol className="relative space-y-12 border-l border-border pl-8">
                {experiences.map((job) => (
                  <li key={job.id} className="relative">
                    <span className="absolute -left-[37px] top-1.5 grid h-4 w-4 place-items-center rounded-full border border-border bg-bg">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>

                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-lg font-medium">
                        {job.role} <span className="text-muted">·</span>{" "}
                        <span className="text-accent">{job.company}</span>
                      </h3>
                      <p className="font-mono text-xs text-muted">
                        {job.startDate} — {job.endDate ?? "Present"}
                      </p>
                    </div>

                    {job.location ? (
                      <p className="mt-1 text-sm text-muted/80">{job.location}</p>
                    ) : null}

                    {job.description ? (
                      <ul className="mt-4 space-y-2">
                        {job.description.split("\n").filter(Boolean).map((line) => (
                          <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {splitTech(job.techStack).length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {splitTech(job.techStack).map((tech) => (
                          <Tag key={tech}>{tech}</Tag>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        {/* --------------------------------------------------------- contact */}
        <section id="contact" className="border-t border-border/60">
          <div className="mx-auto max-w-2xl px-6 py-24">
            <SectionHeading
              label="Contact"
              title="Let's talk"
              blurb="Open to senior backend and AI engineering roles, and to interesting contract work."
            />

            {profile.email || profile.phone ? (
              <div className="mb-10 grid gap-3 sm:grid-cols-2">
                {profile.email ? (
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3.5 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/40"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted">Email</span>
                      <span className="block truncate text-sm text-text transition group-hover:text-accent">
                        {profile.email}
                      </span>
                    </span>
                  </a>
                ) : null}

                {profile.phone ? (
                  <a
                    href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                    className="group flex items-center gap-3.5 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/40"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted">Phone</span>
                      <span className="block truncate text-sm text-text transition group-hover:text-accent">
                        {profile.phone}
                      </span>
                    </span>
                  </a>
                ) : null}
              </div>
            ) : null}

            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="font-mono text-xs">Next.js · Postgres · Vercel</p>
        </div>
      </footer>
    </>
  );
}
