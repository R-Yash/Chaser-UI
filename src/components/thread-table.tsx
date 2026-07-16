"use client";
import { Fragment, useState } from "react";
import { ThreadDTO } from "@/lib/api";
import { StatusBadge, statusMeta } from "./status-badge";
import { NudgeModal } from "./nudge-model";

export function ThreadTable({ threads, dateLabel }: { threads: ThreadDTO[]; dateLabel: string }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [nudgeThread, setNudgeThread] = useState<ThreadDTO | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto border-4 border-black shadow-brutal bg-surface-container">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b-4 border-black bg-surface-bright">
              <th className="w-2 p-0 border-r-4 border-black" />
              {["Company", "Role", dateLabel, "Status"].map((h) => (
                <th key={h} className="p-4 font-label text-xs uppercase text-on-surface-variant border-r-4 border-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {threads.map((t, i) => (
              <Fragment key={t.id}>
                <tr
                  onClick={() => setOpenId(openId === t.id ? null : t.id)}
                  className={`border-b-4 border-black hover:bg-primary-container hover:text-black cursor-pointer ${i % 2 ? "bg-black/20" : ""}`}
                >
                  <td className={`w-2 p-0 border-r-4 border-black ${statusMeta(t).bg}`} />
                  <td className="p-4 border-r-4 border-black font-bold">{t.company ?? "Unknown"}</td>
                  <td className="p-4 border-r-4 border-black">{t.role ?? "—"}</td>
                  <td className="p-4 border-r-4 border-black">{new Date(t.last_message_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <StatusBadge thread={t} onNudgeClick={() => setNudgeThread(t)} />
                  </td>
                </tr>
                {openId === t.id && (
                  <tr className="border-b-4 border-black bg-black/40">
                    <td colSpan={5} className="p-4 text-on-surface-variant text-sm">
                      {t.snippet || "No email content available."}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {nudgeThread && <NudgeModal thread={nudgeThread} onClose={() => setNudgeThread(null)} />}
    </>
  );
}