"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { login } from "@/lib/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, { error: null as string | null });

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/25">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="text-xl font-semibold">Admin access</h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage your portfolio content.</p>
      </div>

      <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-dim disabled:opacity-60"
        >
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
