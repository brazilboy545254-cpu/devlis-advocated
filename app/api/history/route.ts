import { NextResponse } from "next/server";
import { requireUser, signPath } from "@/app/api/_lib";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const decoded = await requireUser(request);
    const { data, error } = await supabaseAdmin
      .from("qr_history")
      .select("*")
      .eq("user_id", decoded.uid)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const items = await Promise.all(
      (data || []).map(async (item) => ({
        ...item,
        signed_urls: {
          original: await signPath(item.original_path),
          reference: await signPath(item.reference_path),
          result: await signPath(item.result_path),
          preview: await signPath(item.result_path)
        }
      }))
    );

    return NextResponse.json({ items });
  } catch (error: any) {
    return new NextResponse(error?.message || "Failed", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const decoded = await requireUser(request);
    const body = await request.json().catch(() => ({}));
    if (body.action === "download" && body.localOnly) {
      return NextResponse.json({ ok: true });
    }
    return new NextResponse("Unsupported", { status: 400 });
  } catch (error: any) {
    return new NextResponse(error?.message || "Failed", { status: 500 });
  }
}
