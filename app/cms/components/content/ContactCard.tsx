import { ContentCard } from "./ContentCard";
import { ContentField } from "./ContentField";
import type { CmsContent } from "../shared/types";

export function ContactCard({ content, onEdit }: { content: CmsContent; onEdit: () => void }) {
  return (
    <ContentCard
      icon="phone"
      iconClass="bg-ok-tint text-ok-text"
      title="Informasi Kontak & Alamat"
      subtitle="WhatsApp, email, dan alamat toko di halaman /customer/kontak"
      editLabel="Edit Kontak"
      onEdit={onEdit}
    >
      <ContentField label="No. Telepon / WhatsApp">{content?.judul || "-"}</ContentField>
      <ContentField label="Email">{content?.subJudul || "-"}</ContentField>
      <ContentField label="Alamat" strong={false}>{content?.konten || "-"}</ContentField>
    </ContentCard>
  );
}
