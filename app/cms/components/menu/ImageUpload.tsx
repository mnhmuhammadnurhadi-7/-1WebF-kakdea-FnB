import { getImageUrl } from "@/lib/api";

type ImageUploadProps = {
  gambar: string;
  uploading: boolean;
  onFile: (file: File) => void;
  onRemove: () => void;
};

/** Unggah gambar menu + pratinjau & tombol hapus. */
export function ImageUpload({ gambar, uploading, onFile, onRemove }: ImageUploadProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor="cms-gambar" className="text-[13px] font-bold text-ink">Upload Gambar</label>
        <input
          id="cms-gambar"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
          disabled={uploading}
          className="w-full text-[13px] text-body file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-brand file:px-4 file:py-2.5 file:text-[13px] file:font-bold file:text-white hover:file:brightness-110"
        />
        {uploading && <span className="text-[12px] text-faint">Uploading...</span>}
      </div>

      {gambar && (
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold text-ink">Preview Gambar</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getImageUrl(gambar)} alt="Preview" className="h-32 w-full rounded-xl object-cover" />
          <button type="button" onClick={onRemove} className="self-start text-[12.5px] font-bold text-bad-text hover:underline">
            Hapus Gambar
          </button>
        </div>
      )}
    </>
  );
}
