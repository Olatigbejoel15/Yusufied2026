"use client"; // Needs the browser to know which page is open

import Link from "next/link"; // Fast page-to-page navigation
import { usePathname } from "next/navigation"; // Tells us the current URL
import { wedding } from "../config";

// The menu links
const links = [
  { href: "/", label: "Home", hideOnPhone: true }, // Logo already links home on phones
  { href: "/upload", label: "Upload" },
  { href: "/gallery", label: "Gallery" },
  { href: "/wishes", label: "Wishes" },
];

export default function Navbar() {
  const pathname = usePathname(); // e.g. "/gallery"

  return (
    <header className="sticky top-0 z-20 border-b border-gold/20 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Names act as the logo and link home */}
        <Link href="/" className="font-display text-xl tracking-wide">
          {wedding.partnerOne} <span className="text-gold">&</span> {wedding.partnerTwo}
        </Link>

        <ul className="flex gap-3 text-[11px] uppercase tracking-wider sm:gap-6 sm:text-sm sm:tracking-widest">
          {links.map((l) => (
            <li key={l.href} className={l.hideOnPhone ? "hidden sm:block" : ""}>
              <Link
                href={l.href}
                className={pathname === l.href ? "text-gold" : "text-ink/70 hover:text-gold"} // Highlight current page
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}