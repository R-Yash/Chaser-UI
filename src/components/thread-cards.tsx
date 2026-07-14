"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

function PipelineStage({ thread }: { thread: ThreadDTO }) {
  const idx = STAGE_INDEX[thread.last_type] ?? 0;
  const style = STAGE_STYLE[idx];
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-[5px] border border-black bg-black/30`}>
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

export function ThreadCards({ threads }: { threads: ThreadDTO[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
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
              <button
                onClick={() => toggleSection(g.label)}
                className="flex items-center gap-2 text-left"
              >
                <ChevronDown size={14} className={`text-on-surface-variant transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                <h4 className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  {g.label} ({items.length})
                </h4>
              </button>
              {!isCollapsed && (
              <div className="columns-1 md:columns-2 xl:columns-3 gap-4">
                {items.map((t) => {
                  const open = openId === t.id;
                  const chip = quietChip(t);
                  return (
                    <div key={t.id} className="flex border-4 border-black bg-surface-container shadow-brutal break-inside-avoid mb-4">
                      <div className={`w-2 shrink-0 ${g.bar}`} />
                      <div
                        onClick={() => setOpenId(open ? null : t.id)}
                        className="flex-1 p-4 flex flex-col gap-3 cursor-pointer"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-black text-lg leading-tight">{t.company ?? "Unknown"}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">{t.role ?? "—"}</p>
                          </div>
                          <StatusBadge thread={t} onNudgeClick={() => setNudgeThread(t)} />
                        </div>

                        <PipelineStage thread={t} />

                        <div className="flex justify-between items-center border-t-2 border-black/40 pt-2">
                          <p className="font-label text-[10px] uppercase text-on-surface-variant/70">
                            Applied {new Date(t.created_at).toLocaleDateString()}
                          </p>
                          <span className={`px-1.5 py-0.5 font-label text-[9px] font-bold uppercase text-black ${chip.bg}`}>
                            {chip.label}
                          </span>
                        </div>

                        {open && (
                          <div className="border-t-2 border-black/40 pt-3 flex flex-col gap-2 text-sm">
                            <p className="text-on-surface-variant">
                              <span className="text-white">Contact:</span>{" "}
                              {t.contact_name ? `${t.contact_name} — ` : ""}
                              {t.contact_email}
                            </p>
                            <p className="text-on-surface-variant">
                              <span className="text-white">Last activity:</span>{" "}
                              {new Date(t.last_message_at).toLocaleDateString()} · {t.message_count}{" "}
                              {t.message_count === 1 ? "message" : "messages"} in this thread
                            </p>
                            <p className="text-on-surface-variant">{t.snippet || "No email content available."}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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