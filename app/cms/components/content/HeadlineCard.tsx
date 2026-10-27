import { ContentCard } from "./ContentCard";
import { ContentField } from "./ContentField";
import type { CmsContent } from "../shared/types";

export function HeadlineCard({ content, onEdit }: { content: CmsContent; onEdit: () => void }) {
  return (
    <ContentCard
      icon="home"
      iconClass="bg-[#e8f0ff] text-brand"
      title="Headline Beranda"
      subtitle="Konten banner utama / hero section pada halaman beranda customer"
      editLabel="Edit Headline"
      onEdit={onEdit}
    >
      <ContentField label="Judul Utama">{content?.judul || "-"}</ContentField>
      {content?.subJudul && <ContentField label="Sub Judul" strong={false}>{content.subJudul}</ContentField>}
      {content?.konten && <ContentField label="Deskripsi" strong={false}>{content.konten}</ContentField>}
    </ContentCard>
  );
}
