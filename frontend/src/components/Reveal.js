"use client"; // Needs the browser to watch scrolling

import { useEffect, useRef, useState } from "react";

// Fades something in the first time it scrolls into view
// delay: milliseconds to wait (give each card a bigger delay so they appear one after another)
// from: "up" slides up while fading in, "blur" sharpens from a soft blur
// as: the HTML tag to use, for example "li" inside a list
export default function Reveal({ children, className = "", delay = 0, from = "up", as: Tag = "div" }) {
  const ref = useRef(null); // Points at the wrapper element
  const [shown, setShown] = useState(false); // True once it has scrolled into view

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true); // Play the animation
          observer.disconnect(); // Only do it once
        }
      },
      { threshold: 0.15 } // Trigger when 15% is visible
    );
    observer.observe(el);
    return () => observer.disconnect(); // Clean up when leaving the page
  }, []);

  const hidden = from === "blur" ? "translate-y-3 opacity-0 blur-md" : "translate-y-6 opacity-0"; // Starting look
  const visible = "translate-y-0 opacity-100 blur-0"; // Final look

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }} // Wait before starting, only when appearing
      className={`transition duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0 ${
        shown ? visible : hidden
      } ${className}`}
    >
      {children}
    </Tag>
  );
}