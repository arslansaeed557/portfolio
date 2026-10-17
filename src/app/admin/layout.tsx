import Link from "next/link";
import { Briefcase, FolderGit2, Inbox, LayoutDashboard, LogOut, Sparkles, User } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { logout } from "@/lib/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", Icon: User },
  { href: "/admin/projects", label: "Projects", Icon: FolderGit2 },
  { href: "/admin/experience", label: "Experience", Icon: Briefcase },
  { href: "/admin/skills", label: "Skills", Icon: Sparkles },
  { href: "/admin/messages", label: "Messages", Icon: Inbox },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The login page renders inside this layout too, so skip the chrome when logged out.
  if (!(await isAuthenticated())) {
    return <div className="flex min-h-screen items-center justify-center p-6">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="shrink-0 border-b border-border bg-surface/50 md:w-60 md:border-b-0 md:border-r">
        <div className="flex h-16 items-center px-5">
          <Link href="/" className="font-mono text-sm text-accent hover:underline">
            ← View site
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface-2 hover:text-text"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <form action={logout} className="px-3 pb-4 md:absolute md:bottom-0 md:w-60">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface-2 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </form>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-3xl px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
