export type StatusKind = "401" | "403" | "404" | "413" | "429" | "500" | "503" | "504" | "offline" | "maintenance" | "online";

export type StatusAction =
  | { label: string; kind: "link"; href: string }
  | { label: string; kind: "retry" }
  | { label: string; kind: "back" };

export type StatusExtra = "path" | "incident" | "diagnostics" | "countdown" | "offlineChips" | "syncPill" | "maintCode";

export type StatusPreset = {
  /** center = judul & maskot di tengah; textLeft / imageLeft = dua kolom */
  layout: "center" | "textLeft" | "imageLeft";
  bg: string;
  dot: string;
  chip: string;
  titleA: string;
  titleB?: string;
  toneA: string;
  toneB: string;
  heading: string;
  body: string;
  /** Adegan maskot SOJU (SVG) + teks alternatif */
  scene: { w: number; alt: string };
  /** Kode kondisi (sistem E-code) */
  code: string;
  extra?: StatusExtra;
  primary: StatusAction;
  secondary?: StatusAction;
  footerStatus: string;
};

const CREAM = "bg-cream";
const BLUE = "text-brand";
const NAVY = "text-navy";

export const PRESETS: Record<StatusKind, StatusPreset> = {
  "401": {
    layout: "center", bg: CREAM, dot: "bg-[#F59E0B]", chip: "SYS-ID: FZN-ID26 • KEAMANAN SESI",
    titleA: "401", titleB: "SESI HABIS", toneA: NAVY, toneB: BLUE,
    heading: "Sesi kerjamu berakhir demi keamanan data.",
    body: "Aplikasi otomatis keluar setelah 30 menit tanpa aktivitas. Silakan masuk kembali untuk melanjutkan pekerjaan.",
    scene: { w: 520, alt: "Maskot SOJU mengantuk di depan laptop terkunci" }, code: "E05",
    primary: { label: "Masuk Kembali ke Akun", kind: "link", href: "/login" },
    secondary: { label: "Buka Halaman Beranda", kind: "link", href: "/customer" },
    footerStatus: "SYS-STATUS: SESSION-LOCKED",
  },
  "403": {
    layout: "center", bg: CREAM, dot: "bg-bad", chip: "SYS-ID: FZN-ID26 • AKSES DITOLAK",
    titleA: "403", titleB: "DILARANG", toneA: BLUE, toneB: NAVY,
    heading: "Kamu belum punya izin untuk membuka halaman ini.",
    body: "Halaman ini khusus untuk peran tertentu. Hubungi pemilik usaha bila kamu merasa seharusnya punya akses.",
    scene: { w: 520, alt: "Maskot SOJU bingung di depan papan akses terbatas" }, code: "E11",
    primary: { label: "Kembali ke Dashboard", kind: "link", href: "/dashboard" },
    secondary: { label: "Masuk dengan Akun Lain", kind: "link", href: "/login" },
    footerStatus: "SYS-STATUS: FORBIDDEN",
  },
  "413": {
    layout: "center", bg: CREAM, dot: "bg-[#F97316]", chip: "SYS-ID: FZN-ID26 • BERKAS TERLALU BESAR",
    titleA: "413", titleB: "TERLALU BESAR", toneA: BLUE, toneB: NAVY,
    heading: "Ukuran berkas melebihi batas yang diizinkan.",
    body: "Kecilkan ukuran berkas (maksimal 2 MB) atau pilih berkas lain, lalu unggah kembali.",
    scene: { w: 520, alt: "Maskot SOJU kewalahan mengangkat berkas besar" }, code: "E20",
    primary: { label: "Pilih Berkas Lain", kind: "back" },
    footerStatus: "SYS-STATUS: PAYLOAD-REJECTED",
  },
  "404": {
    layout: "center", bg: CREAM, dot: "bg-brand", chip: "SYS-ID: FZN-ID26 • NAVIGASI HILANG",
    titleA: "404", titleB: "ERROR", toneA: BLUE, toneB: NAVY,
    heading: "Halaman yang kamu cari tidak ada atau sudah dipindahkan.",
    body: "Mungkin ada salah ketik pada alamat, atau tautan ini sudah berubah.",
    scene: { w: 520, alt: "Maskot Nugi kebingungan membawa peta" }, code: "E07",
    extra: "path",
    primary: { label: "Kembali ke Beranda", kind: "link", href: "/customer" },
    secondary: { label: "Masuk ke Dashboard", kind: "link", href: "/login" },
    footerStatus: "SYS-STATUS: DISCONNECTED",
  },
  "500": {
    layout: "center", bg: CREAM, dot: "bg-[#F97316]", chip: "SYS-ID: FZN-ID26 • GANGGUAN SERVER PUSAT",
    titleA: "500", titleB: "ERROR", toneA: BLUE, toneB: NAVY,
    heading: "Terjadi gangguan internal pada server pusat kami.",
    body: "Ini kendala teknis di sistem kami, bukan kesalahan perangkatmu. Tim teknis sedang memperbaikinya.",
    scene: { w: 520, alt: "Maskot Nugi pusing di dekat server" }, code: "E01",
    extra: "incident",
    primary: { label: "Coba Muat Ulang Halaman", kind: "retry" },
    footerStatus: "SYS-STATUS: DEGRADED",
  },
  "503": {
    layout: "textLeft", bg: "bg-[#FFF8F6]", dot: "bg-bad", chip: "SYS-ID: FZN-ID26 • LAYANAN TERPUTUS",
    titleA: "503", titleB: "OFFLINE", toneA: BLUE, toneB: NAVY,
    heading: "Layanan sedang tidak dapat dijangkau.",
    body: "Pusat layanan sedang mengalami gangguan konektivitas luar. Tim teknis sedang mengalihkan daya cadangan untuk memulihkan modul dapur dan rantai pendingin.",
    scene: { w: 470, alt: "Maskot Nugi dengan daya terputus" }, code: "E03",
    extra: "diagnostics",
    primary: { label: "Coba Lagi", kind: "retry" },
    secondary: { label: "Cek Status Layanan", kind: "link", href: "/status/503" },
    footerStatus: "SYS-STATUS: OUTAGE",
  },
  "504": {
    layout: "center", bg: CREAM, dot: "bg-brand", chip: "SYS-ID: FZN-ID26 • KONEKSI LAMBAT",
    titleA: "504", titleB: "TIMEOUT", toneA: BLUE, toneB: NAVY,
    heading: "Koneksi terlalu lambat.",
    body: "Server tidak menerima respon dalam waktu wajar. Jaringan internetmu mungkin sedang padat, terputus, atau suhu node penyimpanan dingin sedang melakukan sinkronisasi ulang.",
    scene: { w: 520, alt: "Maskot Nugi menunggu jam pasir" }, code: "E02",
    primary: { label: "Coba Lagi", kind: "retry" },
    secondary: { label: "Ganti Jaringan", kind: "link", href: "/login" },
    footerStatus: "SYS-STATUS: TIMEOUT",
  },
  "429": {
    layout: "imageLeft", bg: "bg-[#FFF8F6]", dot: "bg-[#F59E0B]", chip: "SYS-ID: FZN-ID26 • TERLALU CEPAT",
    titleA: "429", titleB: "SLOW DOWN", toneA: BLUE, toneB: NAVY,
    heading: "Terlalu banyak permintaan.",
    body: "Sistem mendeteksi klik atau pengiriman data terlalu cepat ke dapur logistik. Gerbang transmisi distabilkan sementara untuk menjaga integritas stok beku. Tombol akan aktif kembali secara otomatis.",
    scene: { w: 470, alt: "Maskot Nugi kewalahan membawa tumpukan nota" }, code: "E04",
    extra: "countdown",
    primary: { label: "Kirim Ulang Permintaan", kind: "retry" },
    secondary: { label: "Kembali ke Beranda", kind: "link", href: "/customer" },
    footerStatus: "SYS-STATUS: THROTTLED",
  },
  offline: {
    layout: "center", bg: CREAM, dot: "bg-bad", chip: "SYS-ID: FZN-ID26 • KONEKSI TERPUTUS",
    titleA: "OFF", titleB: "LINE", toneA: NAVY, toneB: BLUE,
    heading: "Koneksi internet terputus.",
    body: "Catatan transaksimu aman di perangkat ini. Sistem akan menyinkronkan kembali otomatis begitu internet pulih.",
    scene: { w: 520, alt: "Maskot Nugi dengan router terputus" }, code: "E06",
    extra: "offlineChips",
    primary: { label: "Coba Sambungkan Lagi", kind: "retry" },
    secondary: { label: "Buka Mode Baca (Offline)", kind: "link", href: "/customer" },
    footerStatus: "SYS-STATUS: OFFLINE",
  },
  maintenance: {
    layout: "center", bg: "bg-white", dot: "bg-brand", chip: "SYS-ID: FZN-ID26 • PEMELIHARAAN TERJADWAL",
    titleA: "SYSTEM", titleB: "MAINTENANCE", toneA: BLUE, toneB: NAVY,
    heading: "Sedang berbenah sebentar.",
    body: "Kami sedang meningkatkan performa penyimpanan data dingin dan kecepatan laporan keuangan Dapur SOJU demi operasional frozen food yang lebih lancar.",
    scene: { w: 520, alt: "Maskot Nugi bertugas membersihkan sistem" }, code: "E10",
    extra: "maintCode",
    primary: { label: "Muat Ulang", kind: "retry" },
    footerStatus: "SYS-STATUS: MAINTENANCE",
  },
  online: {
    layout: "center", bg: CREAM, dot: "bg-ok", chip: "SYS-ID: FZN-ID26 • KONEKSI PULIH",
    titleA: "ONLINE", titleB: "/ PULIH", toneA: "text-ok", toneB: NAVY,
    heading: "Internet sudah tersambung kembali!",
    body: "Data transaksi dan buku kas Anda telah diperbarui secara otomatis tanpa ada yang hilang.",
    scene: { w: 520, alt: "Maskot Nugi gembira karena koneksi pulih" }, code: "E01b",
    extra: "syncPill",
    primary: { label: "Kembali ke Dashboard", kind: "link", href: "/dashboard" },
    secondary: { label: "Lihat Riwayat Sinkronisasi", kind: "link", href: "/dashboard/audit" },
    footerStatus: "SYS-STATUS: RECOVERED",
  },
};

export function isStatusKind(v: string): v is StatusKind {
  return v in PRESETS;
}
