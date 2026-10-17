import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/BrandIcons";
import { Nav } from "@/components/Nav";
import { ContactForm } from "@/components/ContactForm";
import {
  getExperiences,
  getProfile,
  getProjects,
  getSkillsByCategory,
  splitTech,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">{label}</p>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
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

  return (
    <>
      <Nav name={profile.name} />

      <main className="flex-1">
        {/* ------------------------------------------------------------ hero */}
        <section className="hero-glow relative overflow-hidden">
          <div className="grid-bg absolute inset-0" />
          <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
            <div className="rise">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Available for new opportunities
              </p>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
                {profile.name}
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-accent sm:text-xl">{profile.headline}</p>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{profile.bio}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-dim"
                >
                  Get in touch
                </a>
                {profile.resumeUrl ? (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium transition hover:border-accent/40 hover:text-accent"
                  >
                    Résumé <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}

                <div className="flex items-center gap-1 sm:ml-2">
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

              {profile.location ? (
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- about */}
        <section id="about" className="border-t border-border/60 bg-surface/30">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <SectionHeading label="About" title="What I work on" />

            <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
              <div className="space-y-4 text-base leading-relaxed text-muted">
                <p>
                  {profile.yearsExperience}+ years building and scaling production systems — from
                  Rails monoliths and Node services to Python data and AI pipelines.
                </p>
                <p>
                  I care about the parts that keep systems healthy as they grow: clear domain
                  boundaries, query and cache behaviour under load, background processing, and
                  observability you can debug from at 3am.
                </p>
              </div>

              {skillGroups.length > 0 ? (
                <div className="space-y-5">
                  {skillGroups.map(([category, items]) => (
                    <div key={category}>
                      <h3 className="mb-2.5 font-mono text-xs uppercase tracking-wider text-muted">
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-lg border border-border bg-surface px-2.5 py-1 text-sm text-text/90"
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
          </div>
        </section>

        {/* ------------------------------------------------------ experience */}
        {experiences.length > 0 ? (
          <section id="experience" className="border-t border-border/60">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <SectionHeading label="Experience" title="Where I've worked" />

              <ol className="relative space-y-10 border-l border-border pl-8">
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
                      <p className="mt-1 text-sm text-muted">{job.location}</p>
                    ) : null}

                    {job.description ? (
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                        {job.description}
                      </p>
                    ) : null}

                    {splitTech(job.techStack).length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
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

        {/* -------------------------------------------------------- projects */}
        {projects.length > 0 ? (
          <section id="projects" className="border-t border-border/60 bg-surface/30">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <SectionHeading label="Projects" title="Selected work" />

              <div className="grid gap-5 sm:grid-cols-2">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent/40"
                  >
                    {project.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-44 w-full object-cover"
                      />
                    ) : null}

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-medium text-text">{project.title}</h3>
                        {project.featured ? (
                          <span className="shrink-0 rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                            Featured
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
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

        {/* --------------------------------------------------------- contact */}
        <section id="contact" className="border-t border-border/60">
          <div className="mx-auto max-w-2xl px-6 py-20">
            <SectionHeading label="Contact" title="Let's talk" />
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="font-mono text-xs">Built with Next.js · Deployed on Vercel</p>
        </div>
      </footer>
    </>
  );
}
