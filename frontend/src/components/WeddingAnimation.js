// Small animated scene: bride and groom walk to a flower arch, rings appear, a heart pops, petals fall

// Colours: change these to adjust skin tone, hair or outfits
const SKIN = "#8a5a3c"; // Skin tone
const HAIR = "#1f1a17"; // Hair colour
const SUIT = "#353a22"; // Groom's suit (deep olive)
const GOLD = "#b3924f"; // Champagne gold accent
const CREAM = "#faf7ee"; // Shirt colour
const BLUSH = "#efe6cc"; // Soft champagne for flowers
const OLIVE = "#6b7340"; // Olive for flowers

// Flower positions along the arch [x, y]
const flowers = [
  [110, 90], [132, 72], [155, 60], [200, 50], [245, 60], [268, 72], [290, 90],
  [110, 150], [110, 210], [290, 150], [290, 210],
];

// Colours the flowers take in turn
const flowerColors = [GOLD, BLUSH, OLIVE];

// Falling petals [x position, delay in seconds, colour]
const petals = [
  [50, 0, GOLD], [90, 0.5, BLUSH], [130, 1.0, OLIVE], [170, 0.2, GOLD],
  [210, 0.8, BLUSH], [250, 0.1, OLIVE], [290, 0.6, GOLD], [330, 0.3, BLUSH], [360, 0.9, OLIVE],
];

export default function WeddingAnimation() {
  return (
    <div className="mx-auto w-72 sm:w-96">
      {/* Animation rules live here so this file is self-contained */}
      <style>{`
        .wa-groom, .wa-bride, .wa-rings, .wa-heart, .wa-petal { transform-box: fill-box; transform-origin: center; }
        .wa-groom { animation: wa-groom 9s ease-in-out infinite; }
        .wa-bride { animation: wa-bride 9s ease-in-out infinite; }
        .wa-rings { animation: wa-rings 9s ease-out infinite; }
        .wa-heart { animation: wa-heart 9s ease-out infinite; }
        .wa-petal { opacity: 0; animation: wa-fall 9s linear infinite; }

        /* Groom walks in from the left, stays, then fades out so the loop restarts */
        @keyframes wa-groom {
          0% { transform: translateX(-110px); opacity: 0; }
          10% { opacity: 1; }
          40%, 90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(0); opacity: 0; }
        }
        /* Bride walks in from the right */
        @keyframes wa-bride {
          0% { transform: translateX(110px); opacity: 0; }
          10% { opacity: 1; }
          40%, 90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(0); opacity: 0; }
        }
        /* Rings pop in after they meet */
        @keyframes wa-rings {
          0%, 40% { transform: scale(0); opacity: 0; }
          48% { transform: scale(1.3); opacity: 1; }
          54%, 90% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        /* Heart pops up above the arch */
        @keyframes wa-heart {
          0%, 52% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.4); opacity: 1; }
          66%, 90% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        /* Petals fall during the second half of the loop */
        @keyframes wa-fall {
          0%, 48% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          55% { opacity: 1; }
          98% { opacity: 1; }
          100% { transform: translateY(290px) rotate(200deg); opacity: 0; }
        }

        /* Respect phones set to "reduce motion": show the finished scene, no movement */
        @media (prefers-reduced-motion: reduce) {
          .wa-groom, .wa-bride, .wa-rings, .wa-heart { animation: none; }
          .wa-petal { display: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 400 270"
        role="img"
        aria-label="Animated bride and groom getting married under a flower arch"
        className="h-auto w-full"
      >
        {/* Ground line */}
        <line x1="60" y1="252" x2="340" y2="252" stroke={GOLD} strokeOpacity="0.4" />

        {/* Flower arch */}
        <path d="M110 250 L110 90 Q200 10 290 90 L290 250" stroke={GOLD} strokeWidth="3" fill="none" />
        {flowers.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" fill={flowerColors[i % 3]} stroke={GOLD} strokeWidth="1" />
        ))}

        {/* GROOM: outer group sets where he stands, inner group does the walking */}
        <g transform="translate(160 0)">
          <g className="wa-groom">
            <rect x="-14" y="190" width="11" height="60" rx="3" fill={SUIT} /> {/* Left leg */}
            <rect x="3" y="190" width="11" height="60" rx="3" fill={SUIT} /> {/* Right leg */}
            <rect x="-17" y="246" width="16" height="6" rx="3" fill={HAIR} /> {/* Left shoe */}
            <rect x="1" y="246" width="16" height="6" rx="3" fill={HAIR} /> {/* Right shoe */}
            <rect x="-35" y="114" width="11" height="68" rx="5" fill={SUIT} /> {/* Left arm */}
            <rect x="24" y="114" width="11" height="68" rx="5" fill={SUIT} /> {/* Right arm */}
            <circle cx="-29.5" cy="186" r="5" fill={SKIN} /> {/* Left hand */}
            <circle cx="29.5" cy="186" r="5" fill={SKIN} /> {/* Right hand */}
            <rect x="-24" y="106" width="48" height="94" rx="10" fill={SUIT} /> {/* Jacket */}
            <path d="M-9 106 L0 142 L9 106 Z" fill={CREAM} /> {/* Shirt */}
            <rect x="-5" y="100" width="10" height="9" fill={SKIN} /> {/* Neck */}
            <path d="M0 112 L-8 107 L-8 117 Z M0 112 L8 107 L8 117 Z" fill={GOLD} /> {/* Bow tie */}
            <circle cx="0" cy="86" r="19" fill={SKIN} /> {/* Head */}
            <path d="M-19 84 Q-20 64 0 64 Q20 64 19 84 Q10 74 0 74 Q-10 74 -19 84 Z" fill={HAIR} /> {/* Hair */}
            <circle cx="-6" cy="87" r="1.8" fill={HAIR} /> {/* Left eye */}
            <circle cx="6" cy="87" r="1.8" fill={HAIR} /> {/* Right eye */}
            <path d="M-6 94 Q0 100 6 94" stroke={HAIR} strokeWidth="2" fill="none" strokeLinecap="round" /> {/* Smile */}
          </g>
        </g>

        {/* BRIDE: same idea, standing on the right */}
        <g transform="translate(240 0)">
          <g className="wa-bride">
            <path d="M-20 72 Q-36 140 -34 232 L34 232 Q36 140 20 72 Z" fill="#ffffff" fillOpacity="0.55" stroke={GOLD} strokeWidth="1" /> {/* Veil */}
            <path d="M-14 116 L14 116 L40 250 L-40 250 Z" fill="#fffdf7" stroke={GOLD} strokeWidth="1.5" /> {/* Dress */}
            <rect x="-14" y="116" width="28" height="6" fill={GOLD} /> {/* Waist band */}
            <rect x="-24" y="112" width="9" height="58" rx="4.5" fill={SKIN} /> {/* Left arm */}
            <rect x="15" y="112" width="9" height="58" rx="4.5" fill={SKIN} /> {/* Right arm */}
            <rect x="-5" y="100" width="10" height="14" fill={SKIN} /> {/* Neck */}
            <circle cx="0" cy="88" r="18" fill={SKIN} /> {/* Head */}
            <path d="M-18 86 Q-19 68 0 68 Q19 68 18 86 Q9 77 0 77 Q-9 77 -18 86 Z" fill={HAIR} /> {/* Hair */}
            <circle cx="0" cy="64" r="7" fill={HAIR} /> {/* Hair bun */}
            <circle cx="-6" cy="89" r="1.8" fill={HAIR} /> {/* Left eye */}
            <circle cx="6" cy="89" r="1.8" fill={HAIR} /> {/* Right eye */}
            <path d="M-6 96 Q0 102 6 96" stroke={HAIR} strokeWidth="2" fill="none" strokeLinecap="round" /> {/* Smile */}
            <circle cx="-6" cy="158" r="7" fill={GOLD} /> {/* Bouquet flower 1 */}
            <circle cx="6" cy="158" r="7" fill={BLUSH} stroke={GOLD} strokeWidth="1" /> {/* Bouquet flower 2 */}
            <circle cx="0" cy="150" r="7" fill={OLIVE} /> {/* Bouquet flower 3 */}
            <circle cx="-19.5" cy="172" r="4.5" fill={SKIN} /> {/* Left hand */}
            <circle cx="19.5" cy="172" r="4.5" fill={SKIN} /> {/* Right hand */}
          </g>
        </g>

        {/* Two linked rings between them */}
        <g className="wa-rings">
          <circle cx="193" cy="125" r="8" fill="none" stroke={GOLD} strokeWidth="3" />
          <circle cx="207" cy="125" r="8" fill="none" stroke={GOLD} strokeWidth="3" />
        </g>

        {/* Heart above the arch */}
        <g transform="translate(200 26)">
          <path className="wa-heart" d="M0 8 C-16 -4 -12 -18 0 -9 C12 -18 16 -4 0 8 Z" fill={GOLD} />
        </g>

        {/* Falling petals */}
        {petals.map(([x, delay, color], i) => (
          <ellipse
            key={i}
            className="wa-petal"
            cx={x}
            cy="0"
            rx="4"
            ry="2.5"
            fill={color}
            style={{ animationDelay: `${delay}s` }} // Each petal starts at a slightly different time
          />
        ))}
      </svg>
    </div>
  );
}