import { getThreads } from "@/lib/api";
import { MetricCard } from "@/components/metric-card";
import { ThreadTable } from "@/components/thread-table";

export default async function JobsAppliedPage() {
  const threads = await getThreads("job");
  const active = threads.filter((t) => t.status === "active" || t.status === "needs_nudge").length;
  const needsNudge = threads.filter((t) => t.status === "needs_nudge").length;
  const closed = threads.filter((t) => t.status === "closed");
  const offers = closed.filter((t) => t.last_type === "offer").length;
  const successRate = closed.length ? Math.round((offers / closed.length) * 100) : 0;

  return (
    <>
      <header className="flex justify-between items-center px-8 py-6 border-b-4 border-black sticky top-0 bg-background z-10">
        <h2 className="font-headline text-4xl font-bold uppercase text-white">Dashboard</h2>
      </header>
      <div className="p-8 flex flex-col gap-8 max-w-[1400px] w-full mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Active Pursuits" value={active} />
          <MetricCard label="Needs Nudge" value={needsNudge} valueClass="text-primary-container" />
          <MetricCard label="Success Rate" value={successRate} unit="%" valueClass="text-secondary" />
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="font-headline text-2xl font-bold uppercase">Jobs Applied</h3>
          <ThreadTable threads={threads} dateLabel="Date Applied" />
        </section>
      </div>
    </>
  );
}