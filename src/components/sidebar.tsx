// src/components/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Jobs Applied" },
  { href: "/dashboard/outreach", label: "Cold Outreach" },
  { href: "/dashboard/rejected", label: "Rejected" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex flex-col h-screen p-4 gap-6 bg-surface-container w-[280px] border-r-4 border-black shrink-0">
      <div>
        <h1 className="font-headline text-2xl font-black text-primary-container">CHASER</h1>
        <p className="font-label text-xs uppercase text-on-surface-variant mt-1">v0.1</p>
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
  );
}