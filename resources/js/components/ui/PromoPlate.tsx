export type PlatePattern =
  | "arcs"
  | "orbit"
  | "stack"
  | "wave"
  | "field"
  | "bloom"
  | "peak"
  | "beam"
  | "tile"
  | "loop";

/**
 * Authored promotional artwork.
 *
 * The concept ships no licensed photography and no external image host, so
 * every offer, brand and category visual is a drawn SVG composition tinted from
 * the subject's own accent. Ten compositions, two tones — enough variety that a
 * grid never repeats itself, and every card is presentation-ready offline.
 */

type Props = {
  pattern: PlatePattern;
  accent: string;
  tone?: "light" | "dark";
  className?: string;
};

const VB = { w: 320, h: 240 };

function layers(accent: string, tone: "light" | "dark") {
  const dark = tone === "dark";
  return {
    ground: dark ? accent : "#FFFFFF",
    wash: dark ? "#FFFFFF" : accent,
    washOpacity: dark ? 0 : 0.06,
    ink: dark ? "#FFFFFF" : accent,
    o: (light: number, darkVal: number) => (dark ? darkVal : light),
  };
}

function Shapes({ pattern, accent, tone }: { pattern: PlatePattern; accent: string; tone: "light" | "dark" }) {
  const L = layers(accent, tone);
  const c = L.ink;
  /** Opacity ramp: light plates need more weight, dark plates less. */
  const a1 = L.o(0.9, 0.96);
  const a2 = L.o(0.42, 0.5);
  const a3 = L.o(0.2, 0.26);
  const a4 = L.o(0.1, 0.14);

  switch (pattern) {
    case "arcs":
      return (
        <g fill="none" stroke={c} strokeLinecap="butt">
          <circle cx="34" cy="228" r="196" strokeWidth="30" opacity={a4} />
          <circle cx="34" cy="228" r="148" strokeWidth="30" opacity={a3} />
          <circle cx="34" cy="228" r="100" strokeWidth="30" opacity={a2} />
          <circle cx="34" cy="228" r="52" strokeWidth="30" opacity={a1} />
          <circle cx="262" cy="52" r="17" fill={c} stroke="none" opacity={a2} />
        </g>
      );
    case "orbit":
      return (
        <g>
          <circle cx="226" cy="94" r="78" fill="none" stroke={c} strokeWidth="30" opacity={a3} />
          <circle cx="226" cy="94" r="120" fill="none" stroke={c} strokeWidth="2" opacity={a4} />
          <circle cx="226" cy="94" r="30" fill={c} opacity={a1} />
          <circle cx="70" cy="190" r="46" fill={c} opacity={a4} />
          <circle cx="70" cy="190" r="16" fill={c} opacity={a2} />
          <circle cx="126" cy="40" r="11" fill={c} opacity={a3} />
        </g>
      );
    case "stack":
      return (
        <g transform="rotate(-13 160 120)">
          <rect x="-40" y="26" width="250" height="32" rx="16" fill={c} opacity={a4} />
          <rect x="42" y="74" width="316" height="32" rx="16" fill={c} opacity={a3} />
          <rect x="-24" y="122" width="214" height="32" rx="16" fill={c} opacity={a1} />
          <rect x="76" y="170" width="284" height="32" rx="16" fill={c} opacity={a2} />
          <rect x="8" y="218" width="168" height="32" rx="16" fill={c} opacity={a4} />
        </g>
      );
    case "wave":
      return (
        <g fill={c}>
          <path d="M-10 128c60-40 110 26 170-4s110-46 170-12v148h-340z" opacity={a4} />
          <path d="M-10 166c58-36 112 22 168-6s112-40 172-10v100h-340z" opacity={a3} />
          <path d="M-10 202c56-30 116 18 170-4s110-30 170-6v58h-340z" opacity={a1} />
        </g>
      );
    case "field": {
      const cells: React.ReactElement[] = [];
      const strong = new Set(["1-1", "3-0", "4-2", "6-1", "2-3", "5-3", "0-2"]);
      for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 5; row++) {
          const key = `${col}-${row}`;
          cells.push(
            <rect
              key={key}
              x={16 + col * 38}
              y={20 + row * 42}
              width="28"
              height="28"
              rx="6"
              fill={c}
              opacity={strong.has(key) ? a1 : (col + row) % 3 === 0 ? a3 : a4}
            />,
          );
        }
      }
      return <g>{cells}</g>;
    }
    case "bloom":
      return (
        <g transform="translate(168 118)">
          {[0, 36, 72, 108, 144].map((deg, i) => (
            <ellipse
              key={deg}
              rx="122"
              ry="38"
              fill="none"
              stroke={c}
              strokeWidth="14"
              opacity={[a3, a4, a3, a4, a4][i]}
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="20" fill={c} opacity={a1} />
          <circle cx="-134" cy="-80" r="13" fill={c} opacity={a3} />
        </g>
      );
    case "peak":
      return (
        <g>
          <circle cx="248" cy="58" r="30" fill={c} opacity={a2} />
          <path d="M-14 240 92 86l74 154z" fill={c} opacity={a3} />
          <path d="M96 240 196 104l84 136z" fill={c} opacity={a1} />
          <path d="M226 240 302 140l40 100z" fill={c} opacity={a2} />
        </g>
      );
    case "beam":
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${330 - i * 74} -10 L${378 - i * 74} -10 L${152 - i * 74} 250 L${104 - i * 74} 250 Z`}
              fill={c}
              opacity={[a1, a3, a2, a4, a3][i]}
            />
          ))}
        </g>
      );
    case "tile": {
      const cells: React.ReactElement[] = [];
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 3; row++) {
          const on = (col + row) % 2 === 0;
          cells.push(
            <rect
              key={`${col}-${row}`}
              x={14 + col * 76}
              y={14 + col * 4 + row * 76}
              width="64"
              height="64"
              rx="12"
              fill={c}
              opacity={on ? a2 : a4}
            />,
          );
        }
      }
      return (
        <g>
          {cells}
          <rect x="90" y="94" width="64" height="64" rx="12" fill={c} opacity={a1} />
        </g>
      );
    }
    case "loop":
      return (
        <g fill="none" stroke={c} strokeWidth="22">
          <rect x="24" y="44" width="150" height="150" rx="46" opacity={a3} />
          <rect x="120" y="76" width="150" height="150" rx="46" opacity={a1} />
          <rect x="196" y="-4" width="110" height="110" rx="34" opacity={a4} />
        </g>
      );
  }
}

export function PromoPlate({ pattern, accent, tone = "light", className }: Props) {
  const L = layers(accent, tone);
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width={VB.w} height={VB.h} fill={L.ground} />
      {tone === "light" && <rect width={VB.w} height={VB.h} fill={accent} opacity={L.washOpacity} />}
      <Shapes pattern={pattern} accent={accent} tone={tone} />
    </svg>
  );
}
