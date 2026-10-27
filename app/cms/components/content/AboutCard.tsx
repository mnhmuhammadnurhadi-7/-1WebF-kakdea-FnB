import { ContentCard } from "./ContentCard";
import { ContentField } from "./ContentField";
import type { CmsContent } from "../shared/types";

export function AboutCard({ content, onEdit }: { content: CmsContent; onEdit: () => void }) {
  return (
    <ContentCard
      icon="users"
      iconClass="bg-sky-tint text-navy"
      title="Tentang Kami"
      subtitle="Profil dan cerita Buku Dapur di halaman /customer/tentang"
      editLabel="Edit Tentang Kami"
      onEdit={onEdit}
    >
      <ContentField label="Judul">{content?.judul || "Tentang Kami"}</ContentField>
      {content?.subJudul && <ContentField label="Sub Judul / Tagline" strong={false}>{content.subJudul}</ContentField>}
      {content?.konten && <ContentField label="Konten Lengkap" strong={false}>{content.konten}</ContentField>}
    </ContentCard>
  );
}
