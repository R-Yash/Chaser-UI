"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ThreadDTO } from "@/lib/api";
import { ThreadTable } from "./thread-table";

const EMPTY_COPY: Record<string, string> = {
  job: "No jobs tracked yet. Apply to a few roles, then sync your inbox to pull them in.",
  outreach: "No cold outreach tracked yet. Send a few emails, then sync your inbox.",
  rejected: "Nothing here yet. Rejections will show up once Chaser spots one.",
};

export function ThreadBoard({
  threads,
  dateLabel,
  category,
}: {
  threads: ThreadDTO[];
  dateLabel: string;
  category: "job" | "outreach" | "rejected";
}) {
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function sync() {
    setSyncing(true);
    try {
      await fetch("/api/sync", { method: "POST" });
    } finally {
      setSyncing(false);
      router.refresh();
    }
  }

  useEffect(() => {
    if (searchParams.get("sync") === "1") {
      sync();
      router.replace(window.location.pathname);
    }
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <div />
        <button
          onClick={sync}
          disabled={syncing}
          className="flex items-center gap-2 font-label text-xs uppercase border-4 border-black px-4 py-2 bg-surface-container hover:bg-primary-container hover:text-black transition-colors disabled:opacity-60"
        >
          {syncing && <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
          {syncing ? "Syncing" : "Sync Inbox"}
        </button>
      </div>

      {syncing ? (
        <div className="border-4 border-black bg-surface-container flex flex-col items-center justify-center gap-4 py-24">
          <span className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="font-label text-sm uppercase text-on-surface-variant">Syncing Jobs</p>
        </div>
      ) : threads.length === 0 ? (
        <div className="border-4 border-black bg-surface-container flex items-center justify-center py-24 px-8 text-center">
          <p className="text-on-surface-variant max-w-md">{EMPTY_COPY[category]}</p>
        </div>
      ) : (
        <ThreadTable threads={threads} dateLabel={dateLabel} />
      )}
    </div>
  );
}