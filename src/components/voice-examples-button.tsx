"use client";
import { useEffect, useState } from "react";
import { Mic, Trash2, X } from "lucide-react";

interface VoiceExample {
  id: number;
  content: string;
  created_at: string;
}

export function VoiceExamplesButton() {
  const [open, setOpen] = useState(false);
  const [examples, setExamples] = useState<VoiceExample[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/voice-examples");
        const data = await res.json();
        if (!cancelled) setExamples(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function addExample(content: string) {
    const res = await fetch("/api/voice-examples", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to add example");
    return data as VoiceExample;
  }

  async function submitText() {
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const created = await addExample(text.trim());
      setExamples([created, ...examples]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add example");
    } finally {
      setBusy(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setBusy(true);
    setError("");
    try {
      const created: VoiceExample[] = [];
      for (const file of Array.from(files)) {
        const content = (await file.text()).trim();
        if (content) created.push(await addExample(content));
      }
      setExamples([...created, ...examples]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload one or more files");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    setBusy(true);
    try {
      await fetch(`/api/voice-examples/${id}`, { method: "DELETE" });
      setExamples(examples.filter((e) => e.id !== id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 font-label text-xs uppercase px-4 py-2 border-4 border-black bg-surface-container hover:bg-primary-container hover:text-black"
      >
        <Mic size={14} /> Voice Examples
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border-4 border-black max-w-xl w-full p-6 flex flex-col gap-4 max-h-[85vh]">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-xl font-bold uppercase">Voice Examples</h3>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant -mt-2">
              The AI uses these to draft follow-ups that sound like you. Paste a few emails you&apos;ve
              actually sent, or upload .txt files. {examples.length}/15 used.
            </p>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Paste an email you've written before..."
              className="w-full text-sm border-4 border-black bg-black/30 p-3 resize-y focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <div className="flex justify-between items-center gap-3">
              <label className="font-label text-xs uppercase px-3 py-2 border-4 border-black cursor-pointer hover:bg-black/30">
                Upload .txt
                <input
                  type="file"
                  multiple
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
              <button
                onClick={submitText}
                disabled={busy || !text.trim()}
                className="font-label text-xs uppercase px-4 py-2 border-4 border-black bg-primary-container text-black disabled:opacity-60"
              >
                Add Example
              </button>
            </div>
            {error && <p className="text-xs text-primary">{error}</p>}

            <div className="flex flex-col gap-2 overflow-y-auto border-t-2 border-black/40 pt-3">
              {loading && <p className="text-xs text-on-surface-variant">Loading...</p>}
              {!loading && examples.length === 0 && (
                <p className="text-xs text-on-surface-variant">No voice examples yet.</p>
              )}
              {examples.map((e) => (
                <div key={e.id} className="flex justify-between items-start gap-2 border-2 border-black/40 p-2">
                  <p className="text-xs text-on-surface-variant line-clamp-2">{e.content}</p>
                  <button onClick={() => remove(e.id)} disabled={busy} className="shrink-0">
                    <Trash2 size={14} className="text-on-surface-variant hover:text-primary-container" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}