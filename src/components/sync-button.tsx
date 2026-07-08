"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function sync() {
    setSyncing(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sync`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setSyncing(false);
      router.refresh();
    }
  }

  useEffect(() => {
    if (searchParams.get("sync") === "1") {
      sync();
      router.replace("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      onClick={sync}
      disabled={syncing}
      className="flex items-center gap-2 font-label text-xs uppercase border-4 border-black px-4 py-2 bg-surface-container hover:bg-primary-container hover:text-black transition-colors disabled:opacity-60"
    >
      {syncing && <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
      {syncing ? "Syncing" : "Sync Inbox"}
    </button>
  );
}