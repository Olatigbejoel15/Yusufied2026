"use client"; // Needs the browser clock

import { useEffect, useState } from "react";

export default function Countdown({ target }) {
  const [left, setLeft] = useState(null); // Milliseconds left (null until the browser loads)

  useEffect(() => {
    const tick = () => setLeft(new Date(target).getTime() - Date.now()); // Time between now and the wedding
    tick(); // Show the value straight away
    const timer = setInterval(tick, 1000); // Then update every second
    return () => clearInterval(timer); // Stop when the page closes
  }, [target]);

  if (left === null) return <div className="h-20" />; // Empty space while loading
  if (left <= 0) return <p className="font-display text-2xl italic text-gold">The celebration has begun!</p>; // After the start time

  const boxes = [
    ["Days", Math.floor(left / 86400000)], // 86,400,000 ms in a day
    ["Hours", Math.floor((left / 3600000) % 24)],
    ["Mins", Math.floor((left / 60000) % 60)],
    ["Secs", Math.floor((left / 1000) % 60)],
  ];

  return (
    <div className="flex gap-3 sm:gap-5">
      {boxes.map(([label, value]) => (
        <div key={label} className="w-16 rounded-xl border border-gold/30 bg-white/70 py-3 text-center sm:w-20">
          <p className="font-display text-3xl sm:text-4xl">{String(value).padStart(2, "0")}</p>
          <p className="text-[10px] uppercase tracking-widest text-ink/60">{label}</p>
        </div>
      ))}
    </div>
  );
}