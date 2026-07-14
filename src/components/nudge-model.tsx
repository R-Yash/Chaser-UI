"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThreadDTO } from "@/lib/api";

export function NudgeModal({ thread, onClose }: { thread: ThreadDTO; onClose: () => void }) {
  const [text, setText] = useState(thread.draft_nudge ?? "");
  const [sending, setSending] = useState(false);
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

        <div className="flex justify-end gap-3">
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
  );
}