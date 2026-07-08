// src/app/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="border-b-4 border-black flex justify-between items-center px-8 py-4">
        <div className="font-headline text-3xl font-bold text-primary-container uppercase">CHASER</div>
        <a href={loginUrl} className="font-label uppercase border-4 border-black px-4 py-2 hover:bg-primary-container hover:text-black transition-colors">
          Connect Gmail
        </a>
      </nav>
      <section className="flex-1 flex flex-col justify-center px-8 gap-6 max-w-3xl">
        <h1 className="font-headline text-6xl md:text-8xl font-black uppercase leading-[0.95] text-white">
          Automate<br /><span className="text-primary-container">the chase</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-lg border-l-4 border-primary-container pl-4">
          Chaser tracks every application and outreach thread in your inbox, and follows up automatically when things go quiet.
        </p>
        <a
          href={loginUrl}
          className="self-start bg-primary-container text-black font-headline text-xl font-bold uppercase border-4 border-black px-8 py-4 shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          Start the Chase
        </a>
      </section>
    </main>
  );
}