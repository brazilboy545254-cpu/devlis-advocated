import { NextResponse } from "next/server";
import { requireUser, uploadDataUrl } from "@/app/api/_lib";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const decoded = await requireUser(request);
    const body = await request.json();
    const {
      originalName,
      referenceName,
      originalDataUrl,
      referenceDataUrl,
      resultDataUrl
    } = body || {};

    if (!originalName || !referenceName || !originalDataUrl || !referenceDataUrl || !resultDataUrl) {
      return new NextResponse("Missing payload", { status: 400 });
    }

    const originalPath = await uploadDataUrl(decoded.uid, originalDataUrl, "originals", originalName);
    const referencePath = await uploadDataUrl(decoded.uid, referenceDataUrl, "references", referenceName);
    const resultPath = await uploadDataUrl(decoded.uid, resultDataUrl, "results", `result-${Date.now()}.png`);

    const { data, error } = await supabaseAdmin
      .from("qr_history")
      .insert({
        user_id: decoded.uid,
        original_name: originalName,
        reference_name: referenceName,
        original_path: originalPath,
        reference_path: referencePath,
        result_path: resultPath,
        download_count: 0
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data });
  } catch (error: any) {
    return new NextResponse(error?.message || "Create failed", { status: 500 });
  }
}
