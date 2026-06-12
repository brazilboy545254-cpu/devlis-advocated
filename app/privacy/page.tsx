import { AppShell } from "@/components/app-shell";

export default function PrivacyPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-white/[0.04] p-6 leading-7 text-white/75 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-4">
          We store only the information needed to operate the app: Google account metadata, QR creation history, and language preference.
          Uploaded files are processed for your session and, where enabled, may be stored to preserve history.
        </p>
        <p className="mt-4">
          This app is built for a privacy-conscious workflow. No guest profiles are created, and access is restricted to Google / Gmail sign-in only.
        </p>
        <p className="mt-4">
          You may delete your account and stored history from the settings page.
        </p>
      </section>
    </AppShell>
  );
}
