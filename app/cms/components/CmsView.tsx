"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AboutModal } from "./content/AboutModal";
import { CmsHeader } from "./header/CmsHeader";
import { CmsSkeleton } from "./state/CmsSkeleton";
import { CmsStats } from "./header/CmsStats";
import { CmsTabs, type CmsTab } from "./header/CmsTabs";
import { ContactModal } from "./content/ContactModal";
import { ContentTab } from "./content/ContentTab";
import { ErrorBanner } from "./state/ErrorBanner";
import { HeadlineModal } from "./content/HeadlineModal";
import { MenuTab } from "./menu/MenuTab";
import { ProductModal } from "./menu/ProductModal";
import { Toast } from "./state/Toast";
import { useCmsData } from "./hooks/useCmsData";
import { useContentEditors } from "./hooks/useContentEditors";
import { useProductEditor } from "./hooks/useProductEditor";

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
      <AppLayout>
        <Toast message={data.notice} onDismiss={() => data.setNotice("")} />
        <CmsSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Toast message={data.notice} onDismiss={() => data.setNotice("")} />
      {data.loadError && (
        <div className="mb-6">
          <ErrorBanner title="Konten CMS belum berhasil dimuat" description="Pastikan koneksi dan sesi masuk Anda aktif, lalu coba muat ulang data." onRetry={data.loadData} />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <CmsHeader onAddMenu={() => product.openProductModal()} />
        <CmsStats menuCount={data.products.length} starredCount={data.starredIds.length} contact={data.contactContent} />
        <CmsTabs value={activeTab} onChange={setActiveTab} menuCount={data.products.length} />

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

      <HeadlineModal open={editors.headlineModalOpen} onClose={() => editors.setHeadlineModalOpen(false)} form={editors.headlineForm} onForm={editors.setHeadlineForm} saving={editors.savingHeadline} onSave={editors.saveHeadline} />
      <AboutModal open={editors.aboutModalOpen} onClose={() => editors.setAboutModalOpen(false)} form={editors.aboutForm} onForm={editors.setAboutForm} saving={editors.savingAbout} onSave={editors.saveAbout} />
      <ContactModal open={editors.contactModalOpen} onClose={() => editors.setContactModalOpen(false)} form={editors.contactForm} onForm={editors.setContactForm} saving={editors.savingContact} onSave={editors.saveContact} />
      <ProductModal editor={product} />
    </AppLayout>
  );
}
