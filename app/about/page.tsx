import { AppShell } from "@/components/app-shell";

export default function AboutPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-white/[0.04] p-6 leading-7 text-white/75 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white">About</h1>
        <p className="mt-4">
          Devli&apos;s Advocated is a premium QR photo conversion experience designed for fast, lightweight use on the web.
          It focuses on a clean workflow: Google-only sign-in, client-side QR styling, and history storage for the user&apos;s own creations.
        </p>
        <p className="mt-4">
          The current processor is intentionally practical and free-tier friendly. It preserves the QR layout as much as possible while applying a visually polished color treatment based on the second uploaded image.
        </p>
      </section>
    </AppShell>
  );
}
