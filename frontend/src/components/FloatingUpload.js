"use client"; // Needs the browser to watch scrolling

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingUpload() {
  const [show, setShow] = useState(false); // True once the guest has scrolled past the hero

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > window.innerHeight * 0.9); // About one screen down
    }
    onScroll(); // Check straight away
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll); // Clean up when leaving the page
  }, []);

  return (
    <Link
      href="/upload"
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-5 z-30 rounded-full bg-ink px-5 py-3 text-xs uppercase tracking-widest text-cream shadow-lg transition duration-500 sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      Upload photos
    </Link>
  );
}