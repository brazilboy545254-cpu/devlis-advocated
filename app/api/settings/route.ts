import { NextResponse } from "next/server";
import { requireUser } from "@/app/api/_lib";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const decoded = await requireUser(request);
    const body = await request.json();
    const language = body.language === "hi" ? "hi" : "en";
    const { error } = await supabaseAdmin
      .from("app_settings")
      .upsert({ user_id: decoded.uid, language, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return new NextResponse(error?.message || "Failed", { status: 400 });
  }
}
