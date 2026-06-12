"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/use-auth";
import { useAppStore } from "@/components/store";
import { Button, Card, GhostButton, Input, Label } from "@/components/ui";
import { toast } from "sonner";
import { LogOut, Shield, Trash2 } from "lucide-react";
import { signUserOut } from "@/lib/firebase/client";

export function SettingsPanel() {
  const { user, firebaseUser } = useAuth();
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.locale === "en" || user.locale === "hi") setLocale(user.locale);
  }, [setLocale, user]);

  async function saveLanguage(next: "en" | "hi") {
    setLocale(next);
    try {
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ language: next })
      });
      toast.success("Settings updated.");
    } catch {
      toast.error("Could not save settings.");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <Card>
        <div className="flex items-center gap-4">
          {user?.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoUrl} alt={user.name} className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-white/10" />
          )}
          <div>
            <h3 className="text-2xl font-semibold text-white">{user?.name || "Google User"}</h3>
            <p className="text-sm text-white/55">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Gmail account name</Label>
            <Input value={user?.name || ""} readOnly />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user?.email || ""} readOnly />
          </div>
          <div>
            <Label>Login method</Label>
            <Input value="Google / Gmail" readOnly />
          </div>
          <div>
            <Label>Language preference</Label>
            <div className="flex gap-2">
              <GhostButton onClick={() => saveLanguage("en")} className={locale === "en" ? "border-cyan-400/40 bg-cyan-400/10" : ""}>English</GhostButton>
              <GhostButton onClick={() => saveLanguage("hi")} className={locale === "hi" ? "border-cyan-400/40 bg-cyan-400/10" : ""}>हिंदी</GhostButton>
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold text-white">Security and privacy</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Only the minimum profile metadata and QR history are stored. The app is designed for Google/Gmail login only.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={async () => {
              setSaving(true);
              try {
                const token = await firebaseUser?.getIdToken();
                if (!token) return;
                await fetch("/api/account/delete", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` }
                });
                await signUserOut();
                toast.success("Account deleted.");
                window.location.href = "/login";
              } catch (error) {
                console.error(error);
                toast.error("Account delete failed.");
              } finally {
                setSaving(false);
              }
            }}
            className="bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500"
          >
            <Trash2 className="h-4 w-4" />
            {saving ? "Deleting..." : "Delete account"}
          </Button>
          <GhostButton
            onClick={async () => {
              await signUserOut();
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </GhostButton>
        </div>
      </Card>
    </div>
  );
}
