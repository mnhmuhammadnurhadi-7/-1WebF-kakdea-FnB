import { useId, type ReactNode } from "react";

/** Maskot SOJU — sosis keju. Vektor datar, outline navy 3,5 px, syal sky, sepatu putih bertali biru. */
export type Mood = "bingung" | "panik" | "lesu" | "lega";
export type Pose = "none" | "cheeks" | "down" | "map" | "thumbs" | "up" | "point";

export const C = {
  navy: "#1E3A8A",
  sky: "#8ED1E4",
  cheese: "#FFC83D",
  cheeseD: "#F5A524",
  sausage: "#E8613A",
  sausageD: "#C2411F",
  blush: "#FF8FA3",
  mouth: "#7A1F1F",
};
const S = 3.5;

/** Lengan: garis dari bahu ke tangan + posisi tangan. */
const ARMS: Record<Pose, { path: string; hand: [number, number] }[]> = {
  none: [],
  cheeks: [
    { path: "M64 164 Q36 160 62 140", hand: [66, 140] },
    { path: "M156 164 Q184 160 158 140", hand: [154, 140] },
  ],
  down: [
    { path: "M64 170 Q44 192 48 214", hand: [48, 217] },
    { path: "M156 170 Q176 192 172 214", hand: [172, 217] },
  ],
  map: [
    { path: "M64 160 Q30 150 44 104 Q50 82 70 66", hand: [72, 64] },
    { path: "M156 170 Q184 184 178 204", hand: [178, 207] },
  ],
  thumbs: [
    { path: "M156 160 Q192 150 186 112", hand: [186, 108] },
    { path: "M64 170 Q42 184 48 206", hand: [48, 209] },
  ],
  up: [
    { path: "M66 150 Q28 140 32 90", hand: [32, 86] },
    { path: "M154 150 Q192 140 188 90", hand: [188, 86] },
  ],
  point: [
    { path: "M156 164 Q196 160 216 150", hand: [218, 149] },
    { path: "M64 170 Q44 192 48 214", hand: [48, 217] },
  ],
};

function Shoe({ x }: { x: number }) {
  return (
    <g>
      <ellipse cx={x} cy={262} rx={19} ry={9.5} fill="#fff" stroke={C.navy} strokeWidth={S} />
      <path d={`M${x - 7} 256 l5 -3 M${x + 1} 255 l5 -2`} stroke="#3B82F6" strokeWidth={2.6} strokeLinecap="round" />
    </g>
  );
}

function Face({ mood }: { mood: Mood }) {
  const eye = (cx: number, o: { rx: number; ry: number; px?: number; py?: number; pr?: number }) => (
    <g key={cx}>
      <ellipse cx={cx} cy={132} rx={o.rx} ry={o.ry} fill="#fff" stroke={C.navy} strokeWidth={3} />
      <circle cx={cx + (o.px ?? 0)} cy={132 + (o.py ?? 0)} r={o.pr ?? 5} fill={C.navy} />
      <circle cx={cx + (o.px ?? 0) + 1.6} cy={132 + (o.py ?? 0) - 1.8} r={1.5} fill="#fff" />
    </g>
  );
  const brow = (d: string) => <path d={d} stroke={C.navy} strokeWidth={3.2} strokeLinecap="round" fill="none" />;

  return (
    <g>
      {/* pipi */}
      <ellipse cx={76} cy={148} rx={8} ry={5.5} fill={C.blush} opacity={mood === "lega" ? 0.95 : 0.7} />
      <ellipse cx={144} cy={148} rx={8} ry={5.5} fill={C.blush} opacity={mood === "lega" ? 0.95 : 0.7} />

      {mood === "bingung" && (
        <>
          {eye(92, { rx: 11, ry: 12, px: -2, py: -3 })}
          {eye(128, { rx: 10, ry: 10, px: -2, py: -3, pr: 4.4 })}
          {brow("M80 114 Q92 106 103 111")}
          {brow("M118 116 L138 110")}
          <path d="M99 156 q5 -5 11 0 t11 0" stroke={C.navy} strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "panik" && (
        <>
          {eye(92, { rx: 13, ry: 14, pr: 3.8 })}
          {eye(128, { rx: 13, ry: 14, pr: 3.8 })}
          {brow("M79 114 L102 106")}
          {brow("M141 114 L118 106")}
          <ellipse cx={110} cy={156} rx={6.5} ry={8.5} fill={C.mouth} stroke={C.navy} strokeWidth={3} />
          <path d="M150 118 q6 9 0 14 q-6 -5 0 -14z" fill={C.sky} stroke={C.navy} strokeWidth={2.4} />
        </>
      )}
      {mood === "lesu" && (
        <>
          {[92, 128].map((cx) => (
            <g key={cx}>
              <path d={`M${cx - 11} 132 a11 9 0 0 0 22 0z`} fill="#fff" stroke={C.navy} strokeWidth={3} strokeLinejoin="round" />
              <circle cx={cx} cy={136} r={3.6} fill={C.navy} />
              <path d={`M${cx - 12} 131 H${cx + 12}`} stroke={C.navy} strokeWidth={4} strokeLinecap="round" />
            </g>
          ))}
          {brow("M80 116 L102 120")}
          {brow("M140 116 L118 120")}
          <path d="M100 156 H120" stroke={C.navy} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {mood === "lega" && (
        <>
          <path d="M80 136 Q92 122 104 136" stroke={C.navy} strokeWidth={3.6} fill="none" strokeLinecap="round" />
          <path d="M116 136 Q128 122 140 136" stroke={C.navy} strokeWidth={3.6} fill="none" strokeLinecap="round" />
          <path d="M96 148 Q110 170 124 148 Z" fill={C.mouth} stroke={C.navy} strokeWidth={3} strokeLinejoin="round" />
          <path d="M103 160 Q110 166 117 160 Q110 155 103 160z" fill={C.blush} />
        </>
      )}
    </g>
  );
}

type SojuMascotProps = {
  mood: Mood;
  pose?: Pose;
  /** Elemen tambahan (topi, properti) digambar di atas badan, koordinat 0 0 220 290 */
  children?: ReactNode;
  /** Sembunyikan kaki & sepatu (mis. sedang duduk di meja) */
  sitting?: boolean;
};

/** Gambar maskot dalam sistem koordinat 220 × 290. Pasang di dalam <svg> atau lewat <SojuFigure>. */
export function SojuMascot({ mood, pose = "none", children, sitting = false }: SojuMascotProps) {
  const id = useId().replace(/:/g, "");
  const arms = ARMS[pose];

  return (
    <g>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E5603A" />
          <stop offset="1" stopColor="#C9451F" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD75E" />
          <stop offset="1" stopColor={C.cheeseD} />
        </linearGradient>
      </defs>

      {!sitting && <ellipse cx={110} cy={276} rx={66} ry={9} fill={C.navy} opacity={0.12} />}

      {/* kaki */}
      {!sitting && (
        <>
          <path d="M92 216 L90 254 M128 216 L130 254" stroke={C.navy} strokeWidth={S} strokeLinecap="round" />
          <Shoe x={86} />
          <Shoe x={134} />
        </>
      )}

      {/* badan sosis */}
      <clipPath id={`${id}k`}>
        <path d="M64 96 A46 46 0 0 1 156 96 V174 A46 46 0 0 1 64 174 Z" />
      </clipPath>
      <rect x={102} y={34} width={16} height={22} rx={7} fill={C.sausageD} stroke={C.navy} strokeWidth={S} />
      <path d="M64 96 A46 46 0 0 1 156 96 V174 A46 46 0 0 1 64 174 Z" fill={`url(#${id}b)`} />
      <g clipPath={`url(#${id}k)`}>
        {/* bekas panggangan */}
        <path d="M50 196 L170 172 M50 214 L170 190 M50 232 L170 208" stroke="#8C2A12" strokeOpacity={0.55} strokeWidth={7} strokeLinecap="round" />
        <path d="M77 140 V196" stroke="#fff" strokeOpacity={0.32} strokeWidth={6} strokeLinecap="round" />
      </g>
      <path d="M64 96 A46 46 0 0 1 156 96 V174 A46 46 0 0 1 64 174 Z" fill="none" stroke={C.navy} strokeWidth={S} strokeLinejoin="round" />

      {/* lembaran keju meleleh menyelimuti kepala */}
      <path
        d="M60 118 C54 98 60 74 80 60 C100 46 120 46 140 60 C160 74 166 98 160 118 C158 123 153 121 152 114 C151 108 146 104 143 108 C141 112 140 118 136 118 C132 118 131 108 127 104 C122 100 116 102 114 104 C108 106 104 102 99 104 C94 106 92 112 88 112 C84 112 83 104 79 104 C75 104 74 112 71 118 C68 124 62 124 60 118 Z"
        fill={`url(#${id}c)`}
        stroke={C.navy}
        strokeWidth={S}
        strokeLinejoin="round"
      />
      {/* lubang keju */}
      <ellipse cx={92} cy={76} rx={5.5} ry={4.2} fill={C.cheeseD} stroke={C.navy} strokeWidth={2} />
      <ellipse cx={130} cy={70} rx={4.2} ry={3.2} fill={C.cheeseD} stroke={C.navy} strokeWidth={2} />
      <ellipse cx={146} cy={92} rx={3.4} ry={2.8} fill={C.cheeseD} stroke={C.navy} strokeWidth={2} />
      <ellipse cx={72} cy={96} rx={3} ry={2.5} fill={C.cheeseD} stroke={C.navy} strokeWidth={2} />

      <g transform="translate(0,-8)"><Face mood={mood} /></g>

      {/* syal sky (ciri khas frozen food) */}
      <path d="M64 160 Q110 180 156 160 V176 Q110 196 64 176 Z" fill={C.sky} stroke={C.navy} strokeWidth={S} strokeLinejoin="round" />
      <path d="M126 181 L148 208 L133 204 L129 218 L116 184 Z" fill={C.sky} stroke={C.navy} strokeWidth={S} strokeLinejoin="round" />

      {/* lengan */}
      {arms.map((a, i) => (
        <g key={i} transform="translate(0,-8)">
          <path d={a.path} stroke={C.navy} strokeWidth={S} strokeLinecap="round" fill="none" />
          <circle cx={a.hand[0]} cy={a.hand[1]} r={7.5} fill={C.cheese} stroke={C.navy} strokeWidth={3} />
        </g>
      ))}
      {pose === "thumbs" && <path d="M186 92 v-9" stroke={C.navy} strokeWidth={3.4} strokeLinecap="round" />}

      {children}
    </g>
  );
}

/** Versi mandiri (satu <svg>) — dipakai di kartu status kecil dan untuk ekspor ke Figma. */
export function SojuFigure({ mood, pose, size = 160, title }: { mood: Mood; pose?: Pose; size?: number; title?: string }) {
  return (
    <svg width={size} height={(size * 290) / 220} viewBox="0 0 220 290" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <SojuMascot mood={mood} pose={pose} />
    </svg>
  );
}
