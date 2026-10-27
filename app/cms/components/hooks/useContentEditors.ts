"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { errMsg } from "../shared/format";
import type { CmsContent, ContactForm, TextForm } from "../shared/types";

type Params = {
  headlineContent: CmsContent;
  aboutContent: CmsContent;
  contactContent: CmsContent;
  loadData: () => Promise<void>;
  setNotice: (msg: string) => void;
};

/** Modal edit Headline Beranda, Tentang Kami, dan Kontak — dipindah apa adanya dari halaman asli. */
export function useContentEditors({ headlineContent, aboutContent, contactContent, loadData, setNotice }: Params) {
  // Headline modal
  const [headlineModalOpen, setHeadlineModalOpen] = useState(false);
  const [headlineForm, setHeadlineForm] = useState<TextForm>({ judul: "", subJudul: "", deskripsi: "" });
  const [savingHeadline, setSavingHeadline] = useState(false);

  // Tentang Kami modal
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutForm, setAboutForm] = useState<TextForm>({ judul: "", subJudul: "", deskripsi: "" });
  const [savingAbout, setSavingAbout] = useState(false);

  // Kontak modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({ telepon: "", email: "", alamat: "" });
  const [savingContact, setSavingContact] = useState(false);

  // Open & Save Headline
  const openHeadlineModal = () => {
    if (headlineContent) {
      setHeadlineForm({
        judul: headlineContent.judul || "",
        subJudul: headlineContent.subJudul || "",
        deskripsi: headlineContent.konten || "",
      });
    } else {
      setHeadlineForm({ judul: "", subJudul: "", deskripsi: "" });
    }
    setHeadlineModalOpen(true);
  };

  const saveHeadline = async () => {
    if (!headlineForm.judul.trim()) {
      setNotice("Judul wajib diisi sebelum disimpan.");
      return;
    }
    setSavingHeadline(true);
    try {
      await api.cms.updateContent("headline_beranda", {
        judul: headlineForm.judul,
        subJudul: headlineForm.subJudul,
        konten: headlineForm.deskripsi,
      });
      setHeadlineModalOpen(false);
      loadData();
    } catch (error) {
      setNotice(errMsg(error, "Gagal menyimpan headline. Silakan coba lagi."));
    } finally {
      setSavingHeadline(false);
    }
  };

  // Open & Save Tentang Kami
  const openAboutModal = () => {
    if (aboutContent) {
      setAboutForm({
        judul: aboutContent.judul || "",
        subJudul: aboutContent.subJudul || "",
        deskripsi: aboutContent.konten || "",
      });
    } else {
      setAboutForm({ judul: "Tentang Kami", subJudul: "", deskripsi: "" });
    }
    setAboutModalOpen(true);
  };

  const saveAbout = async () => {
    if (!aboutForm.judul.trim()) {
      setNotice("Judul wajib diisi sebelum disimpan.");
      return;
    }
    setSavingAbout(true);
    try {
      await api.cms.updateContent("tentang_kami", {
        judul: aboutForm.judul,
        subJudul: aboutForm.subJudul,
        konten: aboutForm.deskripsi,
      });
      setAboutModalOpen(false);
      loadData();
    } catch (error) {
      setNotice(errMsg(error, "Gagal menyimpan konten Tentang Kami. Silakan coba lagi."));
    } finally {
      setSavingAbout(false);
    }
  };

  // Open & Save Kontak
  const openContactModal = () => {
    if (contactContent) {
      setContactForm({
        telepon: contactContent.judul || "",
        email: contactContent.subJudul || "",
        alamat: contactContent.konten || "",
      });
    } else {
      setContactForm({ telepon: "", email: "", alamat: "" });
    }
    setContactModalOpen(true);
  };

  const saveContact = async () => {
    if (!contactForm.telepon && !contactForm.email && !contactForm.alamat) {
      setNotice("Isi setidaknya satu informasi kontak sebelum menyimpan.");
      return;
    }
    if (contactForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) {
      setNotice("Format email belum valid. Periksa kembali alamat email.");
      return;
    }
    setSavingContact(true);
    try {
      await api.cms.updateContent("kontak", {
        judul: contactForm.telepon,
        subJudul: contactForm.email,
        konten: contactForm.alamat,
      });
      setContactModalOpen(false);
      loadData();
    } catch (error) {
      setNotice(errMsg(error, "Gagal menyimpan informasi kontak. Silakan coba lagi."));
    } finally {
      setSavingContact(false);
    }
  };

  return {
    headlineModalOpen, setHeadlineModalOpen, headlineForm, setHeadlineForm, savingHeadline, openHeadlineModal, saveHeadline,
    aboutModalOpen, setAboutModalOpen, aboutForm, setAboutForm, savingAbout, openAboutModal, saveAbout,
    contactModalOpen, setContactModalOpen, contactForm, setContactForm, savingContact, openContactModal, saveContact,
  };
}

export type ContentEditors = ReturnType<typeof useContentEditors>;
