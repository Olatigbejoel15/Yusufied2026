"use client"; // Fetches photos in the browser

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/access";

const API = process.env.NEXT_PUBLIC_API_URL; // Laravel API address from .env.local

export default function GalleryPreview() {
  const [photos, setPhotos] = useState([]); // Latest photos to show

  useEffect(() => {
    async function load() {
      try {
                const res = await apiFetch("/uploads?page=1"); // Sends the code if the visitor has one
        if (!res.ok) return; // No valid code yet: show no photos on the public page
        const json = await res.json();
        setPhotos(json.data.filter((i) => i.type === "image").slice(0, 6)); // Newest 6 photos only
      } catch (e) {
        console.error(e); // Log it, the page still works without photos
      }
    }
    load();
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">Live from the day</p>
      <h2 className="mt-2 text-center font-display text-4xl">Guest moments</h2>

      {photos.length === 0 ? (
        <p className="mt-8 text-center text-ink/60">Photos from our guests will appear here during the wedding.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {photos.map((p) => (
            <img
              key={p.id}
              src={p.url}
              alt="Wedding photo"
              loading="lazy" // Load only when scrolled into view
              className="aspect-square w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/gallery"
          className="inline-block rounded-full border border-ink px-8 py-3 text-sm uppercase tracking-widest transition hover:border-gold hover:text-gold"
        >
          View full gallery
        </Link>
      </div>
    </section>
  );
}