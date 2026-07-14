"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Send, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Jobs Applied", short: "Jobs", icon: Briefcase },
  { href: "/dashboard/outreach", label: "Cold Outreach", short: "Outreach", icon: Send },
  { href: "/dashboard/rejected", label: "Rejected", short: "Rejected", icon: XCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <nav className="hidden md:flex flex-col h-screen p-4 gap-6 bg-surface-container w-[280px] border-r-4 border-black shrink-0">
        <div>
          <h1 className="font-headline text-2xl font-black text-primary-container">CHASER</h1>
          <p className="font-label text-xs uppercase text-on-surface-variant mt-1">v0.3</p>
        </div>
        <div className="flex flex-col gap-2">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "p-3 font-label text-sm uppercase transition-all",
                  active
                    ? "bg-primary-container text-black border-4 border-black shadow-brutal"
                    : "text-on-surface-variant hover:text-black hover:bg-primary-container"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex bg-surface-container border-t-4 border-black">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 font-label text-[10px] uppercase transition-all",
                active ? "bg-primary-container text-black" : "text-on-surface-variant"
              )}
            >
              <Icon size={18} />
              {item.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}