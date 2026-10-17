import { getMessages } from "@/lib/queries";
import { deleteMessage, markMessageRead } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
      <p className="mt-1 text-sm text-muted">Submissions from the contact form.</p>

      <div className="mt-8 space-y-3">
        {messages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No messages yet.
          </p>
        ) : null}

        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-xl border bg-surface p-4 ${
              message.read ? "border-border" : "border-accent/40"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-medium">
                {message.name}{" "}
                <a href={`mailto:${message.email}`} className="text-sm text-accent hover:underline">
                  {message.email}
                </a>
              </h2>
              <time className="font-mono text-xs text-muted">
                {message.createdAt.toLocaleDateString()}
              </time>
            </div>

            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
              {message.body}
            </p>

            <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-3">
              {!message.read ? (
                <form action={markMessageRead}>
                  <input type="hidden" name="id" value={message.id} />
                  <button type="submit" className="text-sm text-accent hover:underline">
                    Mark as read
                  </button>
                </form>
              ) : (
                <span className="text-xs text-muted">Read</span>
              )}
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={message.id} />
                <button type="submit" className="text-sm text-muted transition hover:text-red-400">
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
