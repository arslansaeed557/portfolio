"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/actions";

const INITIAL = { error: null as string | null, sent: false };

const fieldClass =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, INITIAL);

  if (state.sent) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-center">
        <p className="font-medium text-accent">Message sent</p>
        <p className="mt-1 text-sm text-muted">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted">
            Name
          </label>
          <input id="name" name="name" required className={fieldClass} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="body" className="mb-1.5 block text-xs font-medium text-muted">
          Message
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="Tell me about the role or project…"
        />
      </div>

      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
