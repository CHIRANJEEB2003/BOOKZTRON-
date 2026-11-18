// Hand-built SVG artwork: generated book covers, hero illustration and logo.
// Every cover is deterministic per book (seeded by id) so it looks the same on every render.

const W = 300;
const H = 400;

// Small seeded PRNG so each book gets its own stable variation.
function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function wrap(text, max) {
  const lines = [];
  let line = "";
  text.split(" ").forEach((word) => {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  });
  if (line) lines.push(line);
  return lines;
}

/* ---------- genre motifs (drawn in the upper ~60% of the cover) ---------- */

function Fiction({ r, light }) {
  const sunX = 70 + r() * 160;
  return (
    <g>
      <circle cx={sunX} cy={95} r={34 + r() * 14} fill={light} opacity="0.9" />
      <path d={`M0 210 Q75 ${150 + r() * 30} 150 190 T300 175 V400 H0Z`} fill="#000" opacity="0.18" />
      <path d={`M0 240 Q90 ${190 + r() * 30} 180 225 T300 215 V400 H0Z`} fill="#000" opacity="0.22" />
      {[0, 1, 2].map((i) => {
        const x = 40 + r() * 200;
        const y = 50 + r() * 50;
        return (
          <path
            key={i}
            d={`M${x} ${y} q6 -6 12 0 q6 -6 12 0`}
            stroke={light}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      {[0, 1, 2, 3].map((i) => {
        const x = 20 + i * 70 + r() * 30;
        const h = 40 + r() * 35;
        return (
          <g key={i} opacity="0.55">
            <rect x={x - 2} y={235 - h * 0.3} width="4" height={h * 0.4} fill="#000" />
            <circle cx={x} cy={235 - h * 0.5} r={h * 0.3} fill="#000" />
          </g>
        );
      })}
    </g>
  );
}

function Thriller({ r, light }) {
  const buildings = [];
  let x = 0;
  while (x < W) {
    const w = 26 + r() * 30;
    const h = 70 + r() * 120;
    buildings.push({ x, w, h });
    x += w + 2;
  }
  return (
    <g>
      <circle cx={60 + r() * 180} cy={70} r={26} fill={light} opacity="0.85" />
      <circle cx={70 + r() * 160} cy={64} r={24} fill="#000" opacity="0.25" />
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={240 - b.h} width={b.w} height={b.h + 160} fill="#000" opacity="0.55" />
          {Array.from({ length: Math.floor(b.h / 18) }).map((_, j) =>
            [0, 1].map((k) =>
              r() > 0.6 ? (
                <rect
                  key={`${j}-${k}`}
                  x={b.x + 5 + k * (b.w / 2 - 2)}
                  y={240 - b.h + 8 + j * 18}
                  width={Math.max(4, b.w / 2 - 10)}
                  height="7"
                  fill={light}
                  opacity="0.8"
                />
              ) : null
            )
          )}
        </g>
      ))}
      <line x1="0" y1="20" x2="300" y2="20" stroke={light} strokeWidth="1" opacity="0.3" />
    </g>
  );
}

function Fantasy({ r, light }) {
  return (
    <g>
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={i} cx={r() * W} cy={r() * 150} r={r() * 1.8 + 0.6} fill="#fff" opacity={0.5 + r() * 0.5} />
      ))}
      <circle cx={220 - r() * 60} cy={70} r={28} fill={light} />
      <path
        d={`M0 240 L${50 + r() * 30} ${130 + r() * 30} L${120 + r() * 20} 200 L${170 + r() * 20} ${110 + r() * 20} L${240 + r() * 20} 190 L300 ${140 + r() * 30} V400 H0Z`}
        fill="#000"
        opacity="0.35"
      />
      {/* castle */}
      <g fill="#000" opacity="0.55" transform={`translate(${90 + r() * 60} 0)`}>
        <rect x="0" y="175" width="18" height="70" />
        <rect x="56" y="175" width="18" height="70" />
        <rect x="14" y="200" width="46" height="45" />
        <path d="M-3 175 L9 150 L21 175Z M53 175 L65 150 L77 175Z" />
        <rect x="31" y="222" width="12" height="23" fill={light} opacity="0.7" />
      </g>
    </g>
  );
}

function Science({ r, light }) {
  const cx = 150;
  const cy = 130;
  const tilt = r() * 60;
  return (
    <g>
      {Array.from({ length: 8 }).map((_, i) =>
        Array.from({ length: 6 }).map((_, j) => (
          <circle key={`${i}-${j}`} cx={20 + i * 37} cy={20 + j * 40} r="1.5" fill="#fff" opacity="0.25" />
        ))
      )}
      {[0, 60, 120].map((a) => (
        <ellipse
          key={a}
          cx={cx}
          cy={cy}
          rx="95"
          ry="32"
          fill="none"
          stroke={light}
          strokeWidth="3"
          opacity="0.85"
          transform={`rotate(${a + tilt} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r="14" fill={light} />
      {[0, 60, 120].map((a, i) => {
        const t = r() * Math.PI * 2;
        const rad = ((a + tilt) * Math.PI) / 180;
        const ex = 95 * Math.cos(t);
        const ey = 32 * Math.sin(t);
        return (
          <circle
            key={i}
            cx={cx + ex * Math.cos(rad) - ey * Math.sin(rad)}
            cy={cy + ex * Math.sin(rad) + ey * Math.cos(rad)}
            r="6"
            fill="#fff"
          />
        );
      })}
    </g>
  );
}

function Biography({ r, light }) {
  const x = 150 + (r() - 0.5) * 30;
  return (
    <g>
      <rect x="40" y="30" width="220" height="210" rx="110" fill="none" stroke={light} strokeWidth="3" opacity="0.7" />
      <rect x="52" y="42" width="196" height="186" rx="98" fill="#000" opacity="0.15" />
      <circle cx={x} cy={110} r="38" fill={light} opacity="0.9" />
      <path d={`M${x - 75} 228 Q${x - 70} 160 ${x} 158 Q${x + 70} 160 ${x + 75} 228Z`} fill={light} opacity="0.9" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${30 + i * 60} 265 l4 -9 l4 9 l-8 -6 h8z`}
          fill={light}
          opacity={0.4 + r() * 0.4}
        />
      ))}
    </g>
  );
}

function SelfHelp({ r, light }) {
  const rays = 14;
  const sx = 150;
  const sy = 200;
  return (
    <g>
      {Array.from({ length: rays }).map((_, i) => {
        const a = Math.PI + (i / (rays - 1)) * Math.PI;
        return (
          <line
            key={i}
            x1={sx + Math.cos(a) * 60}
            y1={sy + Math.sin(a) * 60}
            x2={sx + Math.cos(a) * (150 + r() * 40)}
            y2={sy + Math.sin(a) * (150 + r() * 40)}
            stroke={light}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />
        );
      })}
      <path d={`M${sx - 50} ${sy} A50 50 0 0 1 ${sx + 50} ${sy}Z`} fill={light} />
      <rect x="0" y={sy} width={W} height="60" fill="#000" opacity="0.2" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={70 + i * 55} y={sy + 14 + i * 12} width={60 - i * 10} height="4" rx="2" fill={light} opacity="0.5" />
      ))}
    </g>
  );
}

const MOTIFS = {
  Fiction,
  Thriller,
  Fantasy,
  Science,
  Biography,
  "Self-Help": SelfHelp,
};

const LIGHTS = ["#ffd166", "#f4f1de", "#ffe8d6", "#caf0f8", "#fcd5ce", "#e9edc9"];

export function BookCover({ book, large }) {
  const r = rng(Number(book.id) || 1);
  const [a, b] = book.colors;
  const light = LIGHTS[Number(book.id) % LIGHTS.length];
  const Motif = MOTIFS[book.genre] || Fiction;
  const gid = `g${book.id}`;
  const titleLines = wrap(book.title, 16);
  const titleY = 300 - (titleLines.length - 1) * 16;

  return (
    <svg
      className={`cover ${large ? "large" : ""}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Cover of ${book.title} by ${book.author}`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <linearGradient id={`${gid}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${gid})`} />
      <Motif r={r} light={light} />
      {/* bottom title band */}
      <rect x="0" y={titleY - 40} width={W} height={H - titleY + 40} fill="#000" opacity="0.28" />
      <line x1="24" y1={titleY - 26} x2="70" y2={titleY - 26} stroke={light} strokeWidth="3" />
      <text x="24" y={titleY} fill="#fff" fontFamily="Georgia, serif" fontWeight="700" fontSize="27">
        {titleLines.map((l, i) => (
          <tspan key={i} x="24" dy={i === 0 ? 0 : 32}>
            {l}
          </tspan>
        ))}
      </text>
      <text
        x="24"
        y={titleY + (titleLines.length - 1) * 32 + 30}
        fill={light}
        fontFamily="system-ui, sans-serif"
        fontSize="15"
        letterSpacing="1.5"
      >
        {book.author.toUpperCase()}
      </text>
      <text x="276" y="378" textAnchor="end" fill="#fff" opacity="0.6" fontFamily="system-ui, sans-serif" fontSize="11" letterSpacing="2">
        {book.genre.toUpperCase()}
      </text>
      {/* spine shading */}
      <rect width="18" height={H} fill={`url(#${gid}s)`} />
    </svg>
  );
}

export function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#b5452b" />
      <path d="M14 18 Q24 14 32 20 V48 Q24 42 14 46Z" fill="#fff" />
      <path d="M50 18 Q40 14 32 20 V48 Q40 42 50 46Z" fill="#ffd9cc" />
      <path d="M40 10 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1z" fill="#ffd166" />
    </svg>
  );
}

const STACK = [
  { w: 230, h: 34, c: "#f4a261", tilt: -2 },
  { w: 200, h: 28, c: "#2a9d8f", tilt: 3 },
  { w: 250, h: 40, c: "#e9c46a", tilt: -1 },
  { w: 215, h: 30, c: "#ffd9cc", tilt: 2 },
  { w: 240, h: 36, c: "#264653", tilt: -3 },
];

export function HeroArt() {
  let y = 300;
  return (
    <svg className="hero-art" viewBox="0 0 360 340" aria-hidden="true">
      <ellipse cx="180" cy="318" rx="150" ry="14" fill="#000" opacity="0.25" />
      {STACK.map((b, i) => {
        y -= b.h + 4;
        const x = 180 - b.w / 2 + (i % 2 ? 10 : -10);
        return (
          <g key={i} transform={`rotate(${b.tilt} 180 ${y + b.h / 2})`}>
            <rect x={x} y={y} width={b.w} height={b.h} rx="4" fill={b.c} />
            <rect x={x + b.w - 18} y={y + 3} width="12" height={b.h - 6} rx="2" fill="#fff" opacity="0.85" />
            <rect x={x + 20} y={y + b.h / 2 - 3} width={b.w * 0.4} height="6" rx="3" fill="#000" opacity="0.2" />
          </g>
        );
      })}
      {/* open book on top */}
      <g transform={`translate(110 ${y - 70})`}>
        <path d="M70 60 Q40 40 0 48 V8 Q40 0 70 20Z" fill="#fff" />
        <path d="M70 60 Q100 40 140 48 V8 Q100 0 70 20Z" fill="#fbeee9" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} stroke="#b5452b" strokeWidth="2" opacity="0.45" strokeLinecap="round">
            <line x1="12" y1={20 + i * 8} x2="58" y2={24 + i * 8} />
            <line x1="82" y1={24 + i * 8} x2="128" y2={20 + i * 8} />
          </g>
        ))}
      </g>
      {[[40, 60], [320, 90], [300, 30], [60, 150]].map(([cx, cy], i) => (
        <path
          key={i}
          d={`M${cx} ${cy - 9} L${cx + 3} ${cy - 3} L${cx + 9} ${cy} L${cx + 3} ${cy + 3} L${cx} ${cy + 9} L${cx - 3} ${cy + 3} L${cx - 9} ${cy} L${cx - 3} ${cy - 3}Z`}
          fill="#ffd166"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}
