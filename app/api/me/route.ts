import { NextResponse } from "next/server";
import { requireUser } from "@/app/api/_lib";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const decoded = await requireUser(request);
    const { data: user } = await supabaseAdmin.from("users").select("*").eq("uid", decoded.uid).single();
    const { data: settings } = await supabaseAdmin.from("app_settings").select("*").eq("user_id", decoded.uid).single();
    return NextResponse.json({ user, settings });
  } catch (error: any) {
    return new NextResponse(error?.message || "Unauthorized", { status: 401 });
  }
}
