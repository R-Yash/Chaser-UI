"use client";
import { useState } from "react";
import { ThreadDTO } from "@/lib/api";
import { StatusBadge } from "./status-badge";
import { NudgeModal } from "./nudge-model";

const STAGES = ["Applied", "Screening", "Interview", "Offer"];

const STAGE_INDEX: Record<string, number> = {
  application_ack: 0,
  recruiter_reply: 0,
  assessment: 1,
  interview_invite: 2,
  offer: 3,
};

const NEXT_HOPE: Record<number, string> = {
  0: "an interview invite",
  1: "an interview invite",
  2: "an offer",
};

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

function PipelineStage({ thread }: { thread: ThreadDTO }) {
  const idx = STAGE_INDEX[thread.last_type] ?? 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        {STAGES.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col gap-1">
            <div className={`h-1.5 border-2 border-black ${i <= idx ? "bg-primary-container" : "bg-black/30"}`} />
            <span className="font-label text-[9px] uppercase text-on-surface-variant hidden md:block">{label}</span>
          </div>
        ))}
      </div>
      <p className="font-label text-[10px] uppercase text-on-surface-variant">
        {idx === 3 ? "Offer received" : `Hoping for: ${NEXT_HOPE[idx]}`}
      </p>
    </div>
  );
}

export function ThreadCards({ threads }: { threads: ThreadDTO[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [nudgeThread, setNudgeThread] = useState<ThreadDTO | null>(null);
  const used = new Set<number>();

  return (
    <>
      <div className="flex flex-col gap-8">
        {GROUPS.map((g) => {
          const items = threads.filter((t) => !used.has(t.id) && g.match(t));
          items.forEach((t) => used.add(t.id));
          if (!items.length) return null;
          return (
            <div key={g.label} className="flex flex-col gap-3">
              <h4 className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                {g.label} ({items.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((t) => {
                  const open = openId === t.id;
                  return (
                    <div key={t.id} className="flex border-4 border-black bg-surface-container shadow-brutal">
                      <div className={`w-2 shrink-0 ${g.bar}`} />
                      <div
                        onClick={() => setOpenId(open ? null : t.id)}
                        className="flex-1 p-4 flex flex-col gap-3 cursor-pointer"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold">{t.company ?? "Unknown"}</p>
                            <p className="text-sm text-on-surface-variant">{t.role ?? "—"}</p>
                          </div>
                          <StatusBadge thread={t} onNudgeClick={() => setNudgeThread(t)} />
                        </div>

                        <PipelineStage thread={t} />

                        <p className="font-label text-[10px] uppercase text-on-surface-variant">
                          Applied {new Date(t.created_at).toLocaleDateString()} · {daysAgo(t.last_message_at)}d quiet
                        </p>

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
            </div>
          );
        })}
      </div>
      {nudgeThread && <NudgeModal thread={nudgeThread} onClose={() => setNudgeThread(null)} />}
    </>
  );
}