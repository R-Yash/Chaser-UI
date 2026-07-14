import { getThreads } from "@/lib/api";
import { ThreadBoard } from "@/components/thread-board";

export default async function RejectedPage() {
  const threads = await getThreads("rejected");

  return (
    <>
      <header className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 border-b-4 border-black sticky top-0 bg-background z-10">
        <h2 className="font-headline text-2xl md:text-4xl font-bold uppercase text-white">Rejected</h2>
      </header>
      <div className="p-4 md:p-8 flex flex-col gap-8 max-w-[1400px] w-full mx-auto">
        <section className="flex flex-col gap-3">
          <h3 className="font-headline text-2xl font-bold uppercase">Rejected Applications</h3>
          <ThreadBoard threads={threads} dateLabel="Date Applied" category="rejected" />
        </section>
      </div>
    </>
  );
}