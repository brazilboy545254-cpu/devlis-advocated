import { AppShell } from "@/components/app-shell";

export default function DeleteAccountPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-white/[0.04] p-6 leading-7 text-white/75 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white">Delete Account</h1>
        <p className="mt-4">
          You can delete your account from Settings. That action removes your user profile, saved QR history, and stored media references from the application database and storage bucket.
        </p>
        <p className="mt-4">
          In addition, the connected Google-authenticated account can be removed from the app session with logout.
        </p>
      </section>
    </AppShell>
  );
}
