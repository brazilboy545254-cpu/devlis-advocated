import { NextResponse } from "next/server";
import { requireUser, deletePaths } from "@/app/api/_lib";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const decoded = await requireUser(request);

    const { data: history } = await supabaseAdmin
      .from("qr_history")
      .select("*")
      .eq("user_id", decoded.uid);

    await deletePaths((history || []).flatMap((item) => [item.original_path, item.reference_path, item.result_path]));

    await supabaseAdmin.from("qr_history").delete().eq("user_id", decoded.uid);
    await supabaseAdmin.from("app_settings").delete().eq("user_id", decoded.uid);
    await supabaseAdmin.from("users").delete().eq("uid", decoded.uid);

    await adminAuth.deleteUser(decoded.uid);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return new NextResponse(error?.message || "Account delete failed", { status: 500 });
  }
}
