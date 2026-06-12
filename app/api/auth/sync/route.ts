import { NextResponse } from "next/server";
import { requireUser, publicUserRecord } from "@/app/api/_lib";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const decoded = await requireUser(request);
    const body = await request.json().catch(() => ({}));
    const locale = body?.locale === "hi" ? "hi" : "en";

    const profile = publicUserRecord({
      uid: decoded.uid,
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      locale
    });

    const { error: userError } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          uid: profile.uid,
          name: profile.name,
          email: profile.email,
          photo_url: profile.photoUrl,
          login_method: profile.loginMethod,
          updated_at: new Date().toISOString()
        },
        { onConflict: "uid" }
      );

    if (userError) throw userError;

    const { error: settingsError } = await supabaseAdmin
      .from("app_settings")
      .upsert(
        {
          user_id: profile.uid,
          language: locale,
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id" }
      );

    if (settingsError) throw settingsError;

    const { data: settings } = await supabaseAdmin.from("app_settings").select("*").eq("user_id", profile.uid).single();

    return NextResponse.json({ user: profile, settings });
  } catch (error: any) {
    return new NextResponse(error?.message || "Unauthorized", { status: 401 });
  }
}
