"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThreadDTO } from "@/lib/api";

export function NudgeModal({ thread, onClose }: { thread: ThreadDTO; onClose: () => void }) {
  const [text, setText] = useState(thread.draft_nudge ?? "");
  const [sending, setSending] = useState(false);
  const [snoozeDays, setSnoozeDays] = useState("3");
  const [snoozing, setSnoozing] = useState(false);
  const router = useRouter();

  async function send() {
    setSending(true);
    try {
      await fetch(`/api/threads/${thread.id}/send-nudge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      router.refresh();
      onClose();
    } finally {
      setSending(false);
    }
  }

  async function snooze() {
    setSnoozing(true);
    try {
      await fetch(`/api/threads/${thread.id}/snooze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: Number(snoozeDays) }),
      });
      router.refresh();
      onClose();
    } finally {
      setSnoozing(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container border-4 border-black max-w-lg w-full p-6 flex flex-col gap-4">
        <h3 className="font-headline text-xl font-bold uppercase">
          Nudge — {thread.company ?? "Unknown"}
        </h3>

        <div>
          <p className="font-label text-xs uppercase text-on-surface-variant mb-1">Last email</p>
          <p className="text-sm text-on-surface-variant border-l-4 border-black pl-3">{thread.snippet}</p>
        </div>

        <div>
          <p className="font-label text-xs uppercase text-on-surface-variant mb-1">Drafted follow-up</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full text-sm whitespace-pre-wrap border-4 border-black bg-black/30 p-3 resize-y focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>

        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={snoozeDays}
              onChange={(e) => setSnoozeDays(e.target.value)}
              className="font-label text-xs uppercase bg-black/30 border-4 border-black px-2 py-2"
            >
              <option value="3">3 days</option>
              <option value="7">1 week</option>
              <option value="14">2 weeks</option>
              <option value="30">1 month</option>
            </select>
            <button
              onClick={snooze}
              disabled={snoozing}
              className="font-label text-xs uppercase px-4 py-2 border-4 border-black hover:bg-black/30 disabled:opacity-60"
            >
              {snoozing ? "Snoozing" : "Snooze"}
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="font-label text-xs uppercase px-4 py-2 border-4 border-black">
              Cancel
            </button>
            <button
              onClick={send}
              disabled={sending || !text.trim()}
              className="font-label text-xs uppercase px-4 py-2 border-4 border-black bg-primary-container text-black disabled:opacity-60"
            >
              {sending ? "Sending" : "Send Nudge"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}