"use client";

import { useState } from "react";
import Link from "next/link";
import { AboutModal } from "./AboutModal";
import { Button } from "./Button";
import { CmsHeader } from "./CmsHeader";
import { CmsSkeleton } from "./CmsSkeleton";
import { CmsStats } from "./CmsStats";
import { CmsTabs, type CmsTab } from "./CmsTabs";
import { ContactModal } from "./ContactModal";
import { ContentTab } from "./ContentTab";
import { HeadlineModal } from "./HeadlineModal";
import { Icon } from "./Icon";
import { MenuTab } from "./MenuTab";
import { ProductModal } from "./ProductModal";
import { useCmsData } from "./useCmsData";
import { useContentEditors } from "./useContentEditors";
import { useProductEditor } from "./useProductEditor";
import { StatePanel } from "@/components/feedback/StatePanel";

/** Logic CMS (muat konten, bintang unggulan, edit konten, kelola menu) dari kode teman; tampilannya memakai komponen di atas. */
export function CmsView() {
  const [activeTab, setActiveTab] = useState<CmsTab>("content");
  const data = useCmsData();
  const editors = useContentEditors({
    headlineContent: data.headlineContent,
    aboutContent: data.aboutContent,
    contactContent: data.contactContent,
    loadData: data.loadData,
    setNotice: data.setNotice,
  });
  const product = useProductEditor({ loadData: data.loadData });

  if (data.loading) {
    return (
      <>
        <CmsSkeleton />
      </>
    );
  }

  return (
    <>
      {data.loadError ? (
        <StatePanel kind="gagal-memuat" subject="Konten CMS" description="Pastikan koneksi dan sesi masuk Anda aktif, lalu coba muat ulang data. Konten yang sudah tersimpan tidak hilang." onRetry={data.loadData} />
      ) : (
      <div className="flex flex-col gap-6">
        <CmsHeader />
        <CmsStats menuCount={data.products.length} starredCount={data.starredIds.length} contact={data.contactContent} />
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap justify-end gap-2">
            <Link
              href="/customer"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-white px-3.5 text-[12.5px] font-bold text-ink shadow-btn transition hover:bg-app"
            >
              Lihat Halaman Customer
              <Icon name="external" size={15} stroke={2} />
            </Link>
            <Button
              size="sm"
              icon="plus"
              onClick={() => product.openProductModal()}
            >
              Tambah Menu
            </Button>
          </div>
          <CmsTabs value={activeTab} onChange={setActiveTab} menuCount={data.products.length} />
        </div>

        {activeTab === "content" ? (
          <ContentTab
            headline={data.headlineContent}
            about={data.aboutContent}
            contact={data.contactContent}
            onEditHeadline={editors.openHeadlineModal}
            onEditAbout={editors.openAboutModal}
            onEditContact={editors.openContactModal}
          />
        ) : (
          <MenuTab
            products={data.products}
            starredIds={data.starredIds}
            onToggleStar={data.toggleStar}
            onEdit={(p) => product.openProductModal(p)}
            onDelete={data.deleteProduct}
          />
        )}
      </div>
      )}

      <HeadlineModal open={editors.headlineModalOpen} onClose={() => editors.setHeadlineModalOpen(false)} form={editors.headlineForm} onForm={editors.setHeadlineForm} saving={editors.savingHeadline} onSave={editors.saveHeadline} />
      <AboutModal open={editors.aboutModalOpen} onClose={() => editors.setAboutModalOpen(false)} form={editors.aboutForm} onForm={editors.setAboutForm} saving={editors.savingAbout} onSave={editors.saveAbout} />
      <ContactModal open={editors.contactModalOpen} onClose={() => editors.setContactModalOpen(false)} form={editors.contactForm} onForm={editors.setContactForm} saving={editors.savingContact} onSave={editors.saveContact} />
      <ProductModal editor={product} />
      {data.confirmDialog}
    </>
  );
}
