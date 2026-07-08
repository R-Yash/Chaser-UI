"use client";
import { Fragment, useState } from "react";
import { ThreadDTO } from "@/lib/api";
import { StatusBadge } from "./status-badge";

function decodeHtml(text: string) {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export function ThreadTable({ threads, dateLabel }: { threads: ThreadDTO[]; dateLabel: string }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="w-full overflow-x-auto border-4 border-black bg-surface-container">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b-4 border-black bg-surface-bright">
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
                <td className="p-4 border-r-4 border-black font-bold">{t.company ?? "Unknown"}</td>
                <td className="p-4 border-r-4 border-black">{t.role ?? "—"}</td>
                <td className="p-4 border-r-4 border-black">{new Date(t.last_message_at).toLocaleDateString()}</td>
                <td className="p-4"><StatusBadge thread={t} /></td>
                </tr>
                {openId === t.id && (
                <tr className="border-b-4 border-black bg-black/40">
                    <td colSpan={4} className="p-4 text-on-surface-variant text-sm">
                        {t.snippet ? decodeHtml(t.snippet) : "No email content available."}
                    </td>
                </tr>
                )}
            </Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
}