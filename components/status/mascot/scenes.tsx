import type { ReactNode } from "react";
import { C, SojuMascot, type Mood, type Pose } from "./SojuMascot";

export type SceneKind = "404" | "500" | "503" | "504" | "429" | "401" | "403" | "413" | "offline" | "maintenance" | "online";

const FONT = "var(--font-plus-jakarta), system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const N = C.navy;

/* ───────── elemen kecil ───────── */
function Chip({ x, y, text, dot, color = N, w }: { x: number; y: number; text: string; dot?: string; color?: string; w?: number }) {
  const width = w ?? text.length * 6.3 + (dot ? 34 : 22);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={width} height={26} rx={13} fill="#fff" stroke="#E4E9F5" strokeWidth={1.5} />
      {dot && <circle cx={14} cy={13} r={4.5} fill={dot} />}
      <text x={dot ? 24 : 11} y={17.5} fontFamily={FONT} fontSize={11} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

function Star({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) {
  return <path transform={`translate(${x},${y}) scale(${s})`} d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill={color} />;
}

function Orbit({ cx = 280, cy = 282, rx = 220, ry = 40 }: { cx?: number; cy?: number; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#C8D2E6" strokeWidth={1.6} strokeDasharray="7 7" />;
}

function Mascot({ mood, pose, x = 186, y = 34, s = 0.88, sitting, children }: { mood: Mood; pose?: Pose; x?: number; y?: number; s?: number; sitting?: boolean; children?: ReactNode }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <SojuMascot mood={mood} pose={pose} sitting={sitting}>{children}</SojuMascot>
    </g>
  );
}

function Card({ x, y, w, h, children, fill = "#fff" }: { x: number; y: number; w: number; h: number; children?: ReactNode; fill?: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={h} rx={14} fill={fill} stroke="#E4E9F5" strokeWidth={1.5} />
      {children}
    </g>
  );
}

function Lock({ x, y, s = 1, color = N }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round">
      <rect x={-12} y={-2} width={24} height={20} rx={5} fill={C.cheese} />
      <path d="M-7 -2 V-8 a7 7 0 0 1 14 0 V-2" />
      <circle cx={0} cy={8} r={2} fill={color} />
    </g>
  );
}

function Wifi({ x, y, off, color = N }: { x: number; y: number; off?: boolean; color?: string }) {
  return (
    <g transform={`translate(${x},${y})`} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
      <path d="M-12 -2 a17 17 0 0 1 24 0 M-7.5 3 a10.5 10.5 0 0 1 15 0" />
      <circle cx={0} cy={9} r={1.8} fill={color} />
      {off && <path d="M-14 -12 L14 14" stroke={C.mouth} strokeWidth={3} />}
    </g>
  );
}

function ServerRack({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={96} height={150} rx={10} fill="#fff" stroke={N} strokeWidth={3.5} />
      {[14, 52].map((t, i) => (
        <g key={t}>
          <rect x={10} y={t} width={76} height={30} rx={6} fill="#F4F6FA" stroke={N} strokeWidth={2.5} />
          <circle cx={22} cy={t + 15} r={4} fill={i ? "#3B82F6" : "#EF4444"} />
          <circle cx={34} cy={t + 15} r={4} fill={i ? "#CBD5E1" : "#F59E0B"} />
          <path d={`M46 ${t + 15} H76`} stroke="#CBD5E1" strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
      <rect x={10} y={92} width={76} height={44} rx={6} fill="#0B1B4A" stroke={N} strokeWidth={2.5} />
      <text x={48} y={112} textAnchor="middle" fontFamily={MONO} fontSize={13} fontWeight={800} fill={C.sky}>-18°C</text>
      <text x={48} y={128} textAnchor="middle" fontFamily={MONO} fontSize={8} fontWeight={800} fill="#F87171">CRIT-ERR</text>
      <path d="M14 150 v8 M82 150 v8" stroke={N} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

function Router({ x, y, off }: { x: number; y: number; off?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M12 0 V-26 M58 0 V-26" stroke={N} strokeWidth={3.5} strokeLinecap="round" />
      <rect width={70} height={30} rx={9} fill="#fff" stroke={N} strokeWidth={3.5} />
      <circle cx={16} cy={15} r={3.4} fill={off ? "#EF4444" : "#10B981"} />
      <circle cx={28} cy={15} r={3.4} fill={off ? "#CBD5E1" : "#10B981"} />
      <circle cx={40} cy={15} r={3.4} fill={off ? "#CBD5E1" : "#10B981"} />
      {off && <path d="M50 8 L62 22 M62 8 L50 22" stroke="#DC2626" strokeWidth={3.4} strokeLinecap="round" />}
    </g>
  );
}

function Hourglass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-6} y={0} width={72} height={10} rx={5} fill={N} />
      <rect x={-6} y={140} width={72} height={10} rx={5} fill={N} />
      <path d="M4 10 H56 C56 50 34 62 30 75 C34 88 56 100 56 140 H4 C4 100 26 88 30 75 C26 62 4 50 4 10 Z" fill="#fff" stroke={N} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M12 16 H48 C46 38 34 48 30 58 C26 48 14 38 12 16 Z" fill="#BFD4FF" />
      <path d="M30 76 V120 M14 134 H46 Q42 112 30 112 Q18 112 14 134Z" fill={C.sky} stroke={C.sky} strokeWidth={3} />
    </g>
  );
}

function NoteStack() {
  const notes: { t: string; fill: string; col: string; r: number; y: number }[] = [
    { t: "SOJU ICE", fill: "#BFD4FF", col: N, r: -5, y: 8 },
    { t: "URGENT  DIMSUM #24", fill: "#FFD9A8", col: "#9A3412", r: 4, y: 38 },
    { t: "SEAFOOD FROZEN", fill: "#fff", col: "#0369A1", r: -3, y: 68 },
  ];
  return (
    <g>
      {notes.map((n) => (
        <g key={n.t} transform={`translate(218,${n.y}) rotate(${n.r} 62 15)`}>
          <rect width={124} height={32} rx={7} fill={n.fill} stroke={N} strokeWidth={3} />
          <text x={62} y={21} textAnchor="middle" fontFamily={FONT} fontSize={10} fontWeight={800} fill={n.col}>{n.t}</text>
        </g>
      ))}
    </g>
  );
}

function Foot({ children, left, right }: { children?: ReactNode; left: string; right: string }) {
  return (
    <g>
      <rect x={70} y={284} width={420} height={30} rx={10} fill="#fff" stroke="#E4E9F5" strokeWidth={1.5} />
      <text x={88} y={303} fontFamily={MONO} fontSize={10.5} fontWeight={800} fill={N}>{left}</text>
      <text x={472} y={303} textAnchor="end" fontFamily={MONO} fontSize={10} fontWeight={700} fill="#737687">{right}</text>
      {children}
    </g>
  );
}

/* ───────── adegan per kondisi ───────── */
function Scene({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "404":
      return (
        <>
          <Orbit />
          <Mascot mood="bingung" pose="map">
            <g transform="translate(168,150) rotate(14)">
              <path d="M0 0 L22 -7 L44 0 L66 -7 V50 L44 57 L22 50 L0 57 Z" fill="#fff" stroke={N} strokeWidth={3} strokeLinejoin="round" />
              <path d="M10 40 Q24 20 36 32 T58 10" fill="none" stroke="#EF4444" strokeWidth={2.4} strokeDasharray="3 4" strokeLinecap="round" />
              <path d="M52 4 l8 8 m0 -8 l-8 8" stroke="#EF4444" strokeWidth={2.4} strokeLinecap="round" />
            </g>
          </Mascot>
          <Card x={56} y={186} w={84} h={84}>
            <path d="M42 24 q-12 -2 -8 -14 q10 2 8 14 q10 -10 14 2 q-8 8 -14 -2z" fill="#10B981" />
            <path d="M30 34 h24 l-3 22 h-18z" fill="none" stroke={N} strokeWidth={3} strokeLinejoin="round" />
            <text x={42} y={74} textAnchor="middle" fontFamily={FONT} fontSize={8.5} fontWeight={800} fill="#737687">HERBA DAPUR</text>
          </Card>
          <Card x={420} y={186} w={84} h={84}>
            <rect x={26} y={24} width={32} height={26} rx={5} fill="#EAF2FF" stroke="#2563EB" strokeWidth={3} />
            <text x={42} y={42} textAnchor="middle" fontFamily={MONO} fontSize={8} fontWeight={800} fill="#2563EB">-18°C</text>
            <text x={42} y={74} textAnchor="middle" fontFamily={FONT} fontSize={8.5} fontWeight={800} fill="#2563EB">COLD BOX</text>
          </Card>
          <Chip x={96} y={44} text="Kemana jalannya?" />
          <Chip x={376} y={58} text="⊘ ?" color="#DC2626" w={50} />
        </>
      );
    case "500":
      return (
        <>
          <Orbit />
          <Mascot mood="panik" pose="cheeks" x={120} />
          <ServerRack x={372} y={110} />
          <path d="M416 100 q-8 -14 0 -28 q8 -14 0 -28 M440 100 q-8 -14 0 -28 q8 -14 0 -28" fill="none" stroke={C.sky} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          <Chip x={100} y={20} text="Server sedang pusing..." dot="#F97316" />
          <circle cx={496} cy={92} r={20} fill="#fff" stroke="#E4E9F5" strokeWidth={1.5} />
          <path d="M488 100 l16 -16 M486 98 l4 4 M502 82 l4 4" stroke={N} strokeWidth={3} strokeLinecap="round" />
        </>
      );
    case "503":
      return (
        <>
          <rect x={20} y={6} width={520} height={312} rx={22} fill="#EDE8E8" />
          <Mascot mood="panik" pose="down" y={22} s={0.86} />
          <path d="M196 224 C150 226 120 244 96 268" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
          <path d="M364 224 C410 226 440 244 464 268" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
          <rect x={80} y={262} width={22} height={14} rx={3} fill="#fff" stroke={N} strokeWidth={3} transform="rotate(-30 91 269)" />
          <rect x={456} y={262} width={22} height={14} rx={3} fill="#fff" stroke={N} strokeWidth={3} transform="rotate(30 467 269)" />
          <path d="M70 232 l-8 -6 M64 246 l-10 -2 M486 232 l8 -6 M492 246 l10 -2" stroke={N} strokeWidth={3} strokeLinecap="round" />
          <Chip x={372} y={58} text="⚡ DAYA TERPUTUS" w={128} />
          <Foot left="● UNIT-SOJU-COLD01" right="PING: REQ_TIMEOUT" />
        </>
      );
    case "504":
      return (
        <>
          <Orbit />
          <Mascot mood="lesu" pose="point" x={100} />
          <Hourglass x={390} y={104} />
          <g transform="translate(70,262)">
            <circle cx={14} cy={-8} r={12} fill={C.sky} stroke={N} strokeWidth={3} />
            <path d="M14 -8 m-6 0 a6 6 0 1 1 6 6" fill="none" stroke={N} strokeWidth={2.2} strokeLinecap="round" />
            <path d="M24 4 H-4 Q-6 -2 0 -4" fill={C.cheese} stroke={N} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <Chip x={300} y={22} text="Loading terlalu lama... (25 detik tanpa respon)" w={252} />
        </>
      );
    case "429":
      return (
        <>
          <rect x={60} y={4} width={440} height={312} rx={24} fill="url(#lav)" />
          <defs>
            <linearGradient id="lav" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FBF3F1" />
              <stop offset="1" stopColor="#E9E8F7" />
            </linearGradient>
          </defs>
          <NoteStack />
          <Mascot mood="panik" pose="up" y={58} s={0.8} />
          <path d="M92 100 q-12 18 0 36 M468 100 q12 18 0 36 M110 84 q-10 10 -6 22 M450 84 q10 10 6 22" fill="none" stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />
          <Foot left="TEMP LOG: -18.4°C" right="TERKUNCI" />
        </>
      );
    case "401":
      return (
        <>
          <Orbit />
          <Mascot mood="lesu" sitting y={46} s={0.86} />
          {/* meja dan laptop menutupi badan bagian bawah */}
          <rect x={150} y={230} width={260} height={16} rx={8} fill="#fff" stroke={N} strokeWidth={3.5} />
          <path d="M162 246 v36 M398 246 v36" stroke={N} strokeWidth={4} strokeLinecap="round" />
          <rect x={214} y={178} width={120} height={52} rx={8} fill="#EAF2FF" stroke={N} strokeWidth={3.5} />
          <Lock x={274} y={196} s={0.9} />
          <circle cx={248} cy={224} r={9} fill={C.cheese} stroke={N} strokeWidth={2.5} />
          <circle cx={308} cy={224} r={9} fill={C.cheese} stroke={N} strokeWidth={2.5} />
          <text x={396} y={80} fontFamily={FONT} fontSize={22} fontWeight={800} fill={C.sky}>z</text>
          <text x={414} y={58} fontFamily={FONT} fontSize={16} fontWeight={800} fill={C.sky}>z</text>
          <Chip x={96} y={46} text="Sudah 30 menit tanpa aktivitas" dot="#F59E0B" />
          <Chip x={396} y={116} text="Sesi Dikunci" dot={C.mouth} />
        </>
      );
    case "403":
      return (
        <>
          <Orbit />
          <Mascot mood="bingung" pose="down" />
          <g transform="translate(404,96)">
            <path d="M0 0 H92 V96 L46 126 L0 96 Z" fill="#fff" stroke={N} strokeWidth={3.5} strokeLinejoin="round" />
            <Lock x={46} y={42} s={1.3} />
            <text x={46} y={86} textAnchor="middle" fontFamily={FONT} fontSize={9} fontWeight={800} fill="#DC2626">AKSES</text>
            <text x={46} y={98} textAnchor="middle" fontFamily={FONT} fontSize={9} fontWeight={800} fill="#DC2626">TERBATAS</text>
          </g>
          <Chip x={84} y={52} text="Ini area khusus admin" dot="#DC2626" />
          <circle cx={118} cy={214} r={26} fill="#fff" stroke="#E4E9F5" strokeWidth={1.5} />
          <circle cx={118} cy={214} r={13} fill="none" stroke="#DC2626" strokeWidth={4} />
          <path d="M109 223 L127 205" stroke="#DC2626" strokeWidth={4} strokeLinecap="round" />
        </>
      );
    case "413":
      return (
        <>
          <Orbit />
          <Mascot mood="panik" pose="up" y={52} s={0.84} />
          <g transform="translate(222,12)">
            <path d="M0 0 H58 L82 24 V86 H0 Z" fill="#fff" stroke={N} strokeWidth={3.5} strokeLinejoin="round" />
            <path d="M58 0 V24 H82" fill="#EAF2FF" stroke={N} strokeWidth={3.5} strokeLinejoin="round" />
            <path d="M14 44 H66 M14 58 H66 M14 72 H44" stroke="#CBD5E1" strokeWidth={4} strokeLinecap="round" />
          </g>
          <Chip x={384} y={34} text="12 MB" color="#DC2626" dot="#DC2626" w={84} />
          <Chip x={384} y={68} text="Batas: 2 MB" dot="#10B981" w={104} />
          <path d="M384 116 H488" stroke="#E4E9F5" strokeWidth={10} strokeLinecap="round" />
          <path d="M384 116 H484" stroke="#EF4444" strokeWidth={10} strokeLinecap="round" />
          <path d="M410 108 v16" stroke="#10B981" strokeWidth={3} strokeLinecap="round" />
        </>
      );
    case "offline":
      return (
        <>
          <Orbit />
          <Mascot mood="panik" pose="cheeks" x={150} />
          <path d="M214 262 C250 262 262 246 300 246" fill="none" stroke={N} strokeWidth={4.5} strokeLinecap="round" />
          <path d="M300 246 L312 236 M304 254 L316 258" stroke="#EF4444" strokeWidth={3.5} strokeLinecap="round" />
          <Router x={352} y={226} off />
          <Chip x={100} y={30} text="! Internet Terputus?" dot="#EF4444" />
          <circle cx={470} cy={64} r={20} fill="#fff" stroke="#E4E9F5" strokeWidth={1.5} />
          <Wifi x={470} y={62} off color="#DC2626" />
        </>
      );
    case "maintenance":
      return (
        <>
          <rect x={40} y={4} width={480} height={312} rx={22} fill="#EAF3FF" />
          <path d="M60 60 H500 M60 150 H500 M60 240 H500 M130 14 V260 M430 14 V260" stroke="#C9DAF5" strokeWidth={1.5} strokeDasharray="5 6" />
          <Mascot mood="lega" pose="down" y={20} s={0.86}>
            {/* helm proyek */}
            <path d="M66 70 C66 38 154 38 154 70 Z" fill="#FFD83B" stroke={C.navy} strokeWidth={3.5} strokeLinejoin="round" />
            <rect x={56} y={68} width={108} height={10} rx={5} fill="#FFC21A" stroke={C.navy} strokeWidth={3.5} />
            <rect x={104} y={44} width={12} height={22} rx={3} fill="#fff" stroke={C.navy} strokeWidth={2.5} />
          </Mascot>
          <rect x={92} y={186} width={46} height={40} rx={6} fill="#BFE9FF" stroke={N} strokeWidth={3} />
          <path d="M72 226 H430" stroke={N} strokeWidth={4} strokeLinecap="round" />
          <g transform="translate(384,190) rotate(18)">
            <rect width={20} height={34} rx={5} fill="#fff" stroke={N} strokeWidth={3} />
            <rect x={5} y={-8} width={10} height={10} rx={3} fill={C.sky} stroke={N} strokeWidth={2.5} />
          </g>
          <Star x={106} y={58} color={C.sky} s={1.2} />
          <Star x={448} y={92} color={C.cheeseD} s={0.9} />
          <Foot left="▣ Soju On Duty" right="STERILISASI" />
        </>
      );
    case "online":
      return (
        <>
          <Orbit />
          <Mascot mood="lega" pose="up" />
          <Star x={140} y={50} color="#059669" s={1.5} />
          <Star x={420} y={32} color="#059669" s={0.9} />
          <Star x={96} y={112} color={C.sky} s={0.8} />
          <Chip x={380} y={78} text="✓ Pulih 100%" w={110} color="#047857" />
          <Chip x={64} y={244} text="ROUTER LINK  STABIL 100%" color="#047857" w={186} />
          <Chip x={326} y={252} text="SINKRONISASI  100% Terkirim" w={196} />
        </>
      );
  }
}

type StatusSceneProps = { kind: SceneKind; width?: number; title?: string };

/** Adegan ilustrasi maskot untuk satu kondisi error. Kanvas 560 × 320. */
export function StatusScene({ kind, width = 560, title }: StatusSceneProps) {
  return (
    <svg width={width} height={(width * 320) / 560} viewBox="0 0 560 320" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} style={{ maxWidth: "100%", height: "auto" }}>
      <Scene kind={kind} />
    </svg>
  );
}
