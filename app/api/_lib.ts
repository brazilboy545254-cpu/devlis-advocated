import { adminAuth } from "@/lib/firebase/admin";
import { supabaseAdmin, storageBucket } from "@/lib/supabase/admin";
import type { Locale } from "@/lib/i18n";
import { randomUUID } from "crypto";

export async function requireUser(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) throw new Error("Missing authorization header.");
  const token = header.slice(7);
  const decoded = await adminAuth.verifyIdToken(token);
  return decoded;
}

export function publicUserRecord(user: {
  uid: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  locale?: Locale;
}) {
  return {
    uid: user.uid,
    name: user.name || "Google User",
    email: user.email || "",
    photoUrl: user.picture || null,
    loginMethod: "Google / Gmail" as const,
    locale: user.locale || "en"
  };
}

export async function uploadDataUrl(uid: string, dataUrl: string, folder: string, fileName: string) {
  const [meta, raw] = dataUrl.split(",");
  const contentType = meta.match(/data:(.*?);base64/)?.[1] || "application/octet-stream";
  const buffer = Buffer.from(raw, "base64");
  const path = `${uid}/${folder}/${randomUUID()}-${fileName}`;
  const { error } = await supabaseAdmin.storage.from(storageBucket).upload(path, buffer, {
    contentType,
    upsert: true
  });
  if (error) throw error;
  return path;
}

export async function signPath(path: string, expiresIn = 60 * 60 * 24 * 7) {
  const { data, error } = await supabaseAdmin.storage.from(storageBucket).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function deletePaths(paths: string[]) {
  if (!paths.length) return;
  await supabaseAdmin.storage.from(storageBucket).remove(paths);
}
