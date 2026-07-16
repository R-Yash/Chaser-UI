"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Pencil, Check, X } from "lucide-react";
import { ThreadDTO } from "@/lib/api";
import { StatusBadge } from "./status-badge";
import { NudgeModal } from "./nudge-model";

const STAGE_INDEX: Record<string, number> = {
  application_ack: 0,
  recruiter_reply: 0,
  assessment: 1,
  interview_invite: 2,
  offer: 3,
};

const STAGE_LABEL: Record<number, string> = { 0: "Applied", 1: "Screening", 2: "Interview", 3: "Offer" };
const STAGE_STYLE: Record<number, { bar: string; text: string }> = {
  0: { bar: "bg-primary-container", text: "text-primary-container" },
  1: { bar: "bg-primary-container", text: "text-primary-container" },
  2: { bar: "bg-secondary", text: "text-secondary" },
  3: { bar: "bg-tertiary", text: "text-tertiary" },
};
const NEXT_HOPE: Record<number, string> = { 0: "an interview invite", 1: "an interview invite", 2: "an offer" };

const TYPE_OPTIONS = [
  { value: "application_ack", label: "Applied / Acknowledged" },
  { value: "recruiter_reply", label: "Recruiter Replied" },
  { value: "assessment", label: "Assessment / Screening" },
  { value: "interview_invite", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejection", label: "Rejected" },
];

const GROUPS: { label: string; bar: string; match: (t: ThreadDTO) => boolean }[] = [
  { label: "Needs a Nudge", bar: "bg-primary-container", match: (t) => t.status === "needs_nudge" },
  { label: "Offers", bar: "bg-tertiary", match: (t) => t.last_type === "offer" },
  { label: "Interviewing", bar: "bg-secondary", match: (t) => t.last_type === "interview_invite" },
  { label: "No Response", bar: "bg-surface-bright", match: (t) => t.status === "stale" },
  { label: "Awaiting Reply", bar: "bg-secondary", match: () => true },
];

function daysAgo(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function quietChip(t: ThreadDTO) {
  const d = daysAgo(t.last_message_at);
  if (t.status === "needs_nudge" || t.status === "stale") return { label: `${d}D QUIET`, bg: "bg-primary-container" };
  if (d <= 3) return { label: "FRESH", bg: "bg-tertiary" };
  return { label: `${d}D QUIET`, bg: "bg-surface-bright" };
}

function toDateInput(dateStr: string) {
  return new Date(dateStr).toISOString().slice(0, 10);
}

function PipelineStage({ thread }: { thread: ThreadDTO }) {
  const idx = STAGE_INDEX[thread.last_type] ?? 0;
  const style = STAGE_STYLE[idx];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-[5px] border border-black bg-black/30">
        <div className={`h-full ${style.bar}`} style={{ width: `${((idx + 1) / 4) * 100}%` }} />
      </div>
      <div className="flex justify-between items-baseline">
        <span className={`font-label text-xs font-bold uppercase tracking-wide ${style.text}`}>{STAGE_LABEL[idx]}</span>
        <span className="font-label text-[10px] text-on-surface-variant/70">
          {idx === 3 ? "Offer received" : `→ hoping for ${NEXT_HOPE[idx]}`}
        </span>
      </div>
    </div>
  );
}

const inputClass = "w-full bg-black/40 border-2 border-black px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-container";

function ThreadCard({ thread, barColor, onNudgeClick }: { thread: ThreadDTO; barColor: string; onNudgeClick: () => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: thread.company ?? "",
    role: thread.role ?? "",
    contact_name: thread.contact_name ?? "",
    contact_email: thread.contact_email,
    last_type: thread.last_type,
    created_at: toDateInput(thread.created_at),
    last_message_at: toDateInput(thread.last_message_at),
  });
  const router = useRouter();
  const chip = quietChip(thread);

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setForm({
      company: thread.company ?? "",
      role: thread.role ?? "",
      contact_name: thread.contact_name ?? "",
      contact_email: thread.contact_email,
      last_type: thread.last_type,
      created_at: toDateInput(thread.created_at),
      last_message_at: toDateInput(thread.last_message_at),
    });
    setEditing(true);
    setOpen(true);
  }

  async function save(e: React.MouseEvent) {
    e.stopPropagation();
    setSaving(true);
    try {
      await fetch(`/api/threads/${thread.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.refresh();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex border-4 border-black bg-surface-container shadow-brutal break-inside-avoid mb-4 transition-shadow duration-150">
      <div className={`w-2 shrink-0 ${barColor}`} />
      <div onClick={() => !editing && setOpen(!open)} className="flex-1 p-4 flex flex-col gap-3 cursor-pointer">
        <div className="flex justify-between items-start gap-2">
          {editing ? (
            <div className="flex-1 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
              <input className={inputClass} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" />
              <input className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" />
            </div>
          ) : (
            <div>
              <p className="font-black text-lg leading-tight">{thread.company ?? "Unknown"}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{thread.role ?? "—"}</p>
            </div>
          )}
          <div className="flex items-center gap-1.5 shrink-0">
            <StatusBadge thread={thread} onNudgeClick={onNudgeClick} />
            {editing ? (
              <>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-1 px-2 py-1 border-2 border-black bg-tertiary text-black font-label text-[10px] uppercase font-bold disabled:opacity-60"
                >
                  <Check size={12} /> {saving ? "Saving" : "Save"}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditing(false); }}
                  disabled={saving}
                  className="p-1 border-2 border-black bg-black/30 hover:bg-black/50"
                >
                  <X size={12} className="text-on-surface-variant" />
                </button>
              </>
            ) : (
              <button onClick={startEdit} className="p-1 border-2 border-black bg-black/30 hover:bg-black/50">
                <Pencil size={11} className="text-on-surface-variant" />
              </button>
            )}
          </div>
        </div>

        {!editing && <PipelineStage thread={thread} />}
        {editing && (
          <select
            className={inputClass}
            value={form.last_type}
            onChange={(e) => setForm({ ...form, last_type: e.target.value })}
            onClick={(e) => e.stopPropagation()}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}

        <div className="flex justify-between items-center border-t-2 border-black/40 pt-2">
          {editing ? (
            <input
              type="date"
              className={inputClass}
              value={form.created_at}
              onChange={(e) => setForm({ ...form, created_at: e.target.value })}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p className="font-label text-[10px] uppercase text-on-surface-variant/70">
              Applied {new Date(thread.created_at).toLocaleDateString()}
            </p>
          )}
          {!editing && (
            <span className={`px-1.5 py-0.5 font-label text-[9px] font-bold uppercase text-black ${chip.bg}`}>{chip.label}</span>
          )}
        </div>

        {open && (
          <div className="border-t-2 border-black/40 pt-3 flex flex-col gap-2 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
            {editing ? (
              <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input className={inputClass} value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} placeholder="Contact name" />
                <input className={inputClass} value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder="Contact email" />
              </div>
            ) : (
              <p className="text-on-surface-variant">
                <span className="text-white">Contact:</span> {thread.contact_name ? `${thread.contact_name} — ` : ""}
                {thread.contact_email}
              </p>
            )}
            {editing ? (
              <div className="flex flex-col gap-1">
                <label className="font-label text-[9px] uppercase text-on-surface-variant/70">
                  Last Activity (drives nudge timing)
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.last_message_at}
                  onChange={(e) => setForm({ ...form, last_message_at: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              <p className="text-on-surface-variant">
                <span className="text-white">Last activity:</span>{" "}
                {new Date(thread.last_message_at).toLocaleDateString()} · {thread.message_count}{" "}
                {thread.message_count === 1 ? "message" : "messages"} in this thread
              </p>
            )}
            <p className="text-on-surface-variant">{thread.snippet || "No email content available."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ThreadCards({ threads }: { threads: ThreadDTO[] }) {
  const [nudgeThread, setNudgeThread] = useState<ThreadDTO | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const used = new Set<number>();

  function toggleSection(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {GROUPS.map((g) => {
          const items = threads.filter((t) => !used.has(t.id) && g.match(t));
          items.forEach((t) => used.add(t.id));
          if (!items.length) return null;
          const isCollapsed = collapsed.has(g.label);
          return (
            <div key={g.label} className="flex flex-col gap-3">
              <button onClick={() => toggleSection(g.label)} className="flex items-center gap-2 text-left">
                <ChevronDown size={14} className={`text-on-surface-variant transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                <h4 className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  {g.label} ({items.length})
                </h4>
              </button>
              {!isCollapsed && (
                <div className="columns-1 md:columns-2 xl:columns-3 gap-4 [column-fill:auto]">
                  {items.map((t) => (
                    <ThreadCard key={t.id} thread={t} barColor={g.bar} onNudgeClick={() => setNudgeThread(t)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {nudgeThread && <NudgeModal thread={nudgeThread} onClose={() => setNudgeThread(null)} />}
    </>
  );
}