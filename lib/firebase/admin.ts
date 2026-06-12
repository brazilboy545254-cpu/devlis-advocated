import { cert, getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

const existing = getApps().length ? getApps()[0] : undefined;
export const firebaseAdminApp =
  existing ??
  initializeApp({
    credential: loadServiceAccount() ? cert(loadServiceAccount() as never) : applicationDefault()
  });

export const adminAuth = getAuth(firebaseAdminApp);
