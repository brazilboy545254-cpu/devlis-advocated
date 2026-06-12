import type { User as FirebaseUser } from "firebase/auth";
import type { Locale } from "@/lib/i18n";

export type AppUser = {
  uid: string;
  name: string;
  email: string;
  photoUrl: string | null;
  loginMethod: "Google / Gmail";
  locale: Locale;
  createdAt?: string;
  updatedAt?: string;
};

export type HistoryItem = {
  id: string;
  user_id: string;
  original_name: string;
  reference_name: string;
  original_path: string;
  reference_path: string;
  result_path: string;
  result_preview_path?: string | null;
  download_count: number;
  created_at: string;
  signed_urls?: {
    original?: string;
    reference?: string;
    result?: string;
    preview?: string;
  };
};

export function toAppUser(user: FirebaseUser, locale: Locale): AppUser {
  return {
    uid: user.uid,
    name: user.displayName || "Google User",
    email: user.email || "",
    photoUrl: user.photoURL,
    loginMethod: "Google / Gmail",
    locale
  };
}
