"use client"; // Runs in the browser, needed for state and timers

import Link from "next/link";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL; // Laravel API address from .env.local

export default function GalleryPage() {
  const [items, setItems] = useState([]); // All uploads loaded so far
  const [page, setPage] = useState(1); // Last page we loaded
  const [hasMore, setHasMore] = useState(false); // True if Laravel has more pages
  const [loading, setLoading] = useState(true); // True until the first load finishes
  const [total, setTotal] = useState(0); // Total uploads on the server

  // Fetches one page of uploads from Laravel
  async function fetchPage(p) {
    const res = await fetch(`${API}/uploads?page=${p}`, {
      headers: { Accept: "application/json" }, // Ask for JSON
      cache: "no-store", // Always get fresh data, never a cached copy
    });
    return res.json();
  }

  useEffect(() => {
    // First load: get page 1
    async function firstLoad() {
      try {
        const json = await fetchPage(1);
        setItems(json.data); // Show the newest uploads
        setTotal(json.total); // Remember the total count
        setHasMore(json.next_page_url !== null); // Laravel says if there is a next page
      } catch (e) {
        console.error(e); // Log the error so we can debug it
      }
      setLoading(false); // Hide the loading text
    }
    firstLoad();

    // Every 15 seconds, check page 1 for new uploads so the gallery feels live
    const timer = setInterval(async () => {
      try {
        const json = await fetchPage(1);
        setTotal(json.total); // Keep the counter current
        setItems((prev) => {
          const known = new Set(prev.map((i) => i.id)); // IDs we already show
          const fresh = json.data.filter((i) => !known.has(i.id)); // Only the new ones
          return [...fresh, ...prev]; // New uploads go at the top
        });
      } catch (e) {
        console.error(e); // Ignore a failed check, the next one will retry
      }
    }, 15000);

    return () => clearInterval(timer); // Stop the timer when leaving the page
  }, []);

  // Loads the next page when the guest taps "Load more"
  async function loadMore() {
    const next = page + 1;
    const json = await fetchPage(next);
    setItems((prev) => {
      const known = new Set(prev.map((i) => i.id)); // Avoid showing a photo twice
      return [...prev, ...json.data.filter((i) => !known.has(i.id))]; // Older uploads go at the bottom
    });
    setPage(next); // Remember which page we are on
    setHasMore(json.next_page_url !== null); // Is there still more?
  }

  return (
    <main className="px-3 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">Shared by our guests</p>
        <h1 className="mt-2 text-center font-display text-4xl sm:text-5xl">Wedding gallery</h1>
        <div className="mx-auto my-5 h-px w-16 bg-gold" />
        {total > 0 && (
          <p className="text-center text-ink/70">
            {total} {total === 1 ? "moment" : "moments"} shared so far
          </p>
        )}

        {loading && <p className="mt-10 text-center text-ink/60">Loading...</p>}

        {!loading && items.length === 0 && (
          <div className="mt-10 text-center text-ink/60">
            <p>No photos yet.</p>
            <Link href="/upload" className="mt-2 inline-block text-gold underline">
              Be the first to share one
            </Link>
          </div>
        )}

        {/* Grid: 2 columns on phones, 3 on tablets, 4 on large screens */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative overflow-hidden rounded-xl bg-blush shadow-sm transition hover:shadow-lg"
            >
              {it.type === "video" ? (
                <video
                  src={`${it.url}#t=0.1`} // #t=0.1 makes phones show a preview frame
                  controls
                  preload="metadata" // Load only the first bit, not the whole video
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <a href={it.url} target="_blank" rel="noreferrer">
                  {/* Plain img tag: simpler than next/image for files on another server */}
                  <img
                    src={it.url}
                    alt={it.guest_name ? `Photo by ${it.guest_name}` : "Wedding photo"}
                    loading="lazy" // Only load photos as they scroll into view
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </a>
              )}

              {/* Small name label in the corner */}
              {it.guest_name && (
                <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-black/50 px-3 py-0.5 text-xs text-white backdrop-blur">
                  {it.guest_name}
                </span>
              )}
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={loadMore}
            className="mx-auto mt-8 block rounded-full border border-ink px-8 py-3 text-sm uppercase tracking-widest transition hover:border-gold hover:text-gold"
          >
            Load more
          </button>
        )}
      </div>
    </main>
  );
}