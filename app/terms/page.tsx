import { AppShell } from "@/components/app-shell";

export default function TermsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-white/[0.04] p-6 leading-7 text-white/75 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white">Terms &amp; Conditions</h1>
        <p className="mt-4">
          By using Devli&apos;s Advocated, you agree to use the service lawfully and to upload only content you own or have permission to process.
        </p>
        <p className="mt-4">
          The QR image styling pipeline is a lightweight client-side approximation. While the app tries to preserve scanability, final usability depends on the quality of the uploaded QR source and the chosen reference image.
        </p>
        <p className="mt-4">
          We may update the product, UI, or storage strategy later to improve reliability, visual quality, or performance.
        </p>
      </section>
    </AppShell>
  );
}
