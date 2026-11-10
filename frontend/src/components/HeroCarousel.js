"use client"; // Needs the browser for the timer

import { useEffect, useState } from "react";
import { wedding } from "../config";

const SLIDE_MS = 7000; // How long each photo stays on screen (7 seconds)

export default function HeroCarousel() {
  const photos = wedding.heroPhotos || []; // Photo list from config.js
  const [current, setCurrent] = useState(0); // Index of the photo showing now

  useEffect(() => {
    if (photos.length < 2) return; // Nothing to rotate with 0 or 1 photo
    // After 7 seconds, move to the next photo (and loop back to the first after the last)
    const timer = setTimeout(() => setCurrent((i) => (i + 1) % photos.length), SLIDE_MS);
    return () => clearTimeout(timer); // Restarts the 7 seconds whenever the photo changes, even by tapping a dot
  }, [current, photos.length]);

  if (photos.length === 0) return null; // No photos: the hero keeps its plain olive background

  return (
    <>
      <style>{`
        /* Each photo fades in and out, and zooms in very slowly while it is showing */
        .hero-slide { opacity: 0; transform: scale(1); transition: opacity 1.5s ease-in-out, transform 9s ease-out; }
        .hero-slide-on { opacity: 1; transform: scale(1.08); }
        /* Phones set to "reduce motion": fade only, no zoom */
        @media (prefers-reduced-motion: reduce) { .hero-slide, .hero-slide-on { transform: none; } }
      `}</style>

      {/* Photos and dark overlay, hidden from screen readers because they are decoration */}
      <div className="absolute inset-0" aria-hidden="true">
        {photos.map((p, i) => (
          <img
            key={p.src}
            src={p.src}
            alt=""
            loading={i === 0 ? "eager" : "lazy"} // First photo loads straight away, the rest later
            className={`hero-slide absolute inset-0 h-full w-full object-cover ${i === current ? "hero-slide-on" : ""}`}
            style={{ objectPosition: p.position || "center 30%" }} // Which part of the photo stays visible
          />
        ))}
        {/* Dark olive layer so cream text is readable on any photo */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(36,40,22,0.55), rgba(36,40,22,0.7))" }}
        />
      </div>

      {/* Dots: tap one to jump to that photo */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
          {photos.map((p, i) => (
            <button
              key={p.src}
              onClick={() => setCurrent(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-[#e6cf9f]" : "w-2 bg-cream/50"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}