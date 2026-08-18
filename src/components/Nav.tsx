"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/new", label: "New jobs" },
  { href: "/shortlisted", label: "Shortlisted" },
  { href: "/applied", label: "Applied" },
  { href: "/interviews", label: "Interviews" },
  { href: "/all", label: "All jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/import", label: "Import jobs" },
  { href: "/settings", label: "Search settings" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="w-[220px] shrink-0 bg-ink-900 text-white h-screen flex flex-col p-5">
      <div className="mb-8">
        <p className="font-mono text-[13px] tracking-widest text-ink-300 uppercase">Career radar</p>
        <p className="text-[12px] text-ink-300 mt-1">Find better roles. Apply smarter.</p>
      </div>

      <ul className="flex-1 space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "block rounded-lg px-3 py-2 text-[13px] transition-colors",
                  active ? "bg-white/10 text-white" : "text-ink-300 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
