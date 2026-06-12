import { NextResponse } from "next/server";
import { requireUser, deletePaths } from "@/app/api/_lib";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const decoded = await requireUser(request);
    const { id } = await params;

    const { data: item, error: fetchError } = await supabaseAdmin
      .from("qr_history")
      .select("*")
      .eq("id", id)
      .eq("user_id", decoded.uid)
      .single();

    if (fetchError || !item) throw fetchError || new Error("Not found");

    await deletePaths([item.original_path, item.reference_path, item.result_path]);

    const { error } = await supabaseAdmin.from("qr_history").delete().eq("id", id).eq("user_id", decoded.uid);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return new NextResponse(error?.message || "Delete failed", { status: 500 });
  }
}
