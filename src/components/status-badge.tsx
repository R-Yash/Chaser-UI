import { cn } from "@/lib/utils";
import { ThreadDTO } from "@/lib/api";

export function statusMeta(t: ThreadDTO) {
  if (t.snoozed_until && new Date(t.snoozed_until) > new Date()) return { label: "SNOOZED", bg: "bg-surface-bright" };
  if (t.status === "needs_nudge") return { label: "NEEDS NUDGE", bg: "bg-primary-container" };
  if (t.last_type === "interview_invite") return { label: "INTERVIEWING", bg: "bg-primary-container" };
  if (t.last_type === "offer") return { label: "OFFER", bg: "bg-tertiary" };
  if (t.last_type === "rejection") return { label: "REJECTED", bg: "bg-error" };
  if (t.status === "stale") return { label: "STALE", bg: "bg-surface-bright" };
  return { label: "AWAITING REPLY", bg: "bg-secondary" };
}

export function StatusBadge({ thread, onNudgeClick }: { thread: ThreadDTO; onNudgeClick?: () => void }) {
  const { label, bg } = statusMeta(thread);
  return (
    <span className="flex items-center gap-2">
      <span className={cn("inline-block px-2 py-1 border-2 border-black font-label text-[10px] uppercase font-bold text-black", bg)}>
        {label}
      </span>
      {thread.status === "needs_nudge" && (
        <button
          onClick={(e) => { e.stopPropagation(); onNudgeClick?.(); }}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-error text-black font-bold text-xs border-2 border-black"
          title="Nudge ready"
        >
          !
        </button>
      )}
    </span>
  );
}