import { AiView } from "./components/AiView";

const KNOWN_COMMANDS = ["/add", "/ask", "/edit", "/stock"];

export default async function AIPage({ searchParams }: { searchParams: Promise<{ cmd?: string }> }) {
  const { cmd } = await searchParams;
  // Hanya perintah yang dikenal yang boleh mengisi kotak ketik (mencegah teks sembarang dari URL).
  const initialInput = cmd && KNOWN_COMMANDS.includes(cmd) ? `${cmd} ` : "";
  return <AiView initialInput={initialInput} />;
}
