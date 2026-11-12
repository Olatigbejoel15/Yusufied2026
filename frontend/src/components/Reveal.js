"use client"; // Needs the browser to watch scrolling

import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, className = "" }) {
  const ref = useRef(null); // Points at the wrapper div
  const [shown, setShown] = useState(false); // True once the section has scrolled into view

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true); // Play the fade-in
          observer.disconnect(); // Only do it once
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the section is visible
    );
    observer.observe(el);
    return () => observer.disconnect(); // Clean up when leaving the page
  }, []);

  return (
    <div
      ref={ref}
      className={`transition duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}