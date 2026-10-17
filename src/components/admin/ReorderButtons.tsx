import { ChevronDown, ChevronUp } from "lucide-react";
import { moveItem } from "@/lib/actions";

/**
 * Up/down controls for a list row. The action reference must be static:
 * Next doesn't bind a server action passed in as a prop or picked at runtime,
 * and the form then silently degrades to a plain GET submit.
 */
export function ReorderButtons({
  id,
  kind,
  isFirst,
  isLast,
  label,
}: {
  id: number;
  kind: "project" | "experience";
  isFirst: boolean;
  isLast: boolean;
  label: string;
}) {
  const buttonClass =
    "grid h-7 w-7 place-items-center rounded-md border border-border bg-bg text-muted transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted";

  return (
    <div className="flex shrink-0 flex-col gap-1">
      <form action={moveItem}>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button
          type="submit"
          disabled={isFirst}
          aria-label={`Move ${label} up`}
          className={buttonClass}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      </form>

      <form action={moveItem}>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button
          type="submit"
          disabled={isLast}
          aria-label={`Move ${label} down`}
          className={buttonClass}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
