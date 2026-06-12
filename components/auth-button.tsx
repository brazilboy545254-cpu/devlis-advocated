"use client";

import { signInWithGoogle, signUserOut } from "@/lib/firebase/client";
import { Button, GhostButton } from "@/components/ui";
import { LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        try {
          await signInWithGoogle();
          router.push("/dashboard");
        } catch (error) {
          console.error(error);
          toast.error("Google sign-in failed.");
        }
      }}
      className="w-full sm:w-auto"
    >
      <Sparkles className="h-4 w-4" />
      Continue with Google
    </Button>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <GhostButton
      onClick={async () => {
        await signUserOut();
        router.push("/login");
      }}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </GhostButton>
  );
}

export function SignInMethodBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
      <ShieldCheck className="h-3.5 w-3.5" />
      Google / Gmail only
    </span>
  );
}
