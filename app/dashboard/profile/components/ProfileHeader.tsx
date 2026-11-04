export function ProfileHeader({ savedFlash }: { savedFlash: boolean }) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-.03em]">Profil &amp; Pengaturan</h1>
        <p className="mt-1.5 max-w-[560px] text-[15px] text-body">Kelola data toko, akun pengguna, dan preferensi aplikasi Buku Dapur.</p>
      </div>
      {savedFlash && (
        <span role="status" className="inline-flex items-center gap-2 rounded-full bg-ok-tint px-4 py-2 text-[13px] font-bold text-ok-text shadow-btn">
          ✅ Perubahan berhasil disimpan
        </span>
      )}
    </section>
  );
}
