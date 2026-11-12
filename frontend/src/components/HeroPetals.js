// Soft champagne petals drifting down over the hero photos (pure CSS)

// Each petal: [left position %, size px, start delay s, fall time s, sideways drift px, colour]
const petals = [
  [6, 10, 0, 14, 30, "#e6cf9f"],
  [14, 8, 3, 17, -25, "#f5ecd9"],
  [22, 12, 6, 15, 35, "#b3924f"],
  [31, 9, 1, 18, -30, "#f5ecd9"],
  [39, 11, 8, 14, 28, "#e6cf9f"],
  [47, 8, 4, 19, -20, "#f5ecd9"],
  [55, 12, 9, 16, 32, "#b3924f"],
  [63, 9, 2, 15, -28, "#e6cf9f"],
  [71, 10, 7, 18, 25, "#f5ecd9"],
  [79, 8, 5, 14, -35, "#e6cf9f"],
  [86, 11, 10, 17, 30, "#b3924f"],
  [93, 9, 3, 16, -22, "#f5ecd9"],
];

export default function HeroPetals() {
  return (
    // Sits above the photos, never blocks taps, and is hidden from screen readers
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      <style>{`
        .petal { position: absolute; top: -20px; border-radius: 80% 0 80% 0; opacity: 0; will-change: transform; animation: petal-fall linear infinite; }
        @keyframes petal-fall {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.85; }
          90% { opacity: 0.85; }
          100% { transform: translate3d(var(--sway), 70vh, 0) rotate(300deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .petal { display: none; } }
      `}</style>
      {petals.map(([left, size, delay, duration, sway, color], i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${left}%`, // Where across the screen it starts
            width: size, // Petal width
            height: size * 1.3, // Petal height
            background: color, // Petal colour
            animationDelay: `${delay}s`, // Each petal starts at a different time
            animationDuration: `${duration}s`, // And falls at its own speed
            "--sway": `${sway}px`, // How far it drifts sideways while falling
          }}
        />
      ))}
    </div>
  );
}