"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Download, Loader2, Wand2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { FileDropzone } from "@/components/file-dropzone";
import { processQrArtwork } from "@/lib/qr/processor";
import { blobFromDataUrl, downloadDataUrl } from "@/lib/utils";
import { useAppStore } from "@/components/store";
import { useAuth } from "@/components/use-auth";

export function QrWorkflow() {
  const { user, firebaseUser } = useAuth();
  const locale = useAppStore((s) => s.locale);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const canCreate = !!originalFile && !!referenceFile && !processing;
  const resultRef = useRef<string | null>(null);
  resultRef.current = result;

  const copy = useMemo(() => {
    return locale === "en"
      ? {
          original: "Original QR",
          reference: "Style reference",
          create: "Create",
          download: "Download PNG",
          preview: "Result preview",
          note: "Client-side approximation. Scanability depends on input quality."
        }
      : {
          original: "मूल QR",
          reference: "स्टाइल रेफरेंस",
          create: "बनाएँ",
          download: "PNG डाउनलोड करें",
          preview: "परिणाम पूर्वावलोकन",
          note: "क्लाइंट-साइड अनुमानित प्रोसेसिंग। स्कैनिंग गुणवत्ता इनपुट पर निर्भर है।"
        };
  }, [locale]);

  async function handleCreate() {
    if (!originalFile || !referenceFile) {
      toast.error("Please upload both images.");
      return;
    }
    setProcessing(true);
    try {
      const [originalDataUrl, referenceDataUrl] = await Promise.all([
        fileToDataUrl(originalFile),
        fileToDataUrl(referenceFile)
      ]);
      const dataUrl = await processQrArtwork({
        originalDataUrl,
        referenceDataUrl,
        size: 1024
      });
      setResult(dataUrl);
      toast.success("QR artwork created.");
    } catch (error) {
      console.error(error);
      toast.error("Could not create the QR image.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleDownload() {
    if (!result) return;
    downloadDataUrl(result, `devlis-advocated-${Date.now()}.png`);
    try {
      const token = await firebaseUser?.getIdToken();
      if (!token) return;
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "download", localOnly: true })
      });
    } catch {
      // Silent; download already completed.
    }
  }

  async function persistCreation() {
    if (!result || !originalFile || !referenceFile || !firebaseUser) {
      toast.error("Create an image first.");
      return;
    }
    const token = await firebaseUser.getIdToken();
    const res = await fetch("/api/qr/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        originalName: originalFile.name,
        referenceName: referenceFile.name,
        originalDataUrl: await fileToDataUrl(originalFile),
        referenceDataUrl: await fileToDataUrl(referenceFile),
        resultDataUrl: result
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    toast.success("Saved to history.");
    return data;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-5">
        <FileDropzone
          label={copy.original}
          hint="Upload the source QR photo."
          onFile={(file, preview) => {
            setOriginalFile(file);
            setOriginalPreview(preview);
          }}
        />
        <FileDropzone
          label={copy.reference}
          hint="Upload the style reference photo."
          onFile={(file, preview) => {
            setReferenceFile(file);
            setReferencePreview(preview);
          }}
        />

        <Card className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Workflow</h3>
              <p className="mt-1 text-sm text-white/55">{copy.note}</p>
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Google / Gmail only
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={!canCreate} onClick={handleCreate} className="flex-1">
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {processing ? "Processing..." : copy.create}
            </Button>
            <Button
              disabled={!result}
              onClick={async () => {
                try {
                  await persistCreation();
                } catch (error) {
                  console.error(error);
                  toast.error("History save failed.");
                }
              }}
              className="flex-1 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-500"
            >
              Save to history
            </Button>
          </div>
        </Card>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_35%)]" />
        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">{copy.preview}</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">Premium QR Result</h3>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Ready for PNG export
            </span>
          </div>

          <motion.div
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 p-4 shadow-2xl"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            {result ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result} alt="Generated QR result" className="aspect-square w-full rounded-[24px] object-contain" />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] text-center text-white/50">
                <div>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                    <Wand2 className="h-7 w-7 text-cyan-300/80" />
                  </div>
                  Upload both images and create your result.
                </div>
              </div>
            )}
          </motion.div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button disabled={!result} onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4" />
              {copy.download}
            </Button>
            <Button
              disabled={!result}
              onClick={async () => {
                if (!result) return;
                await downloadDataUrl(result, `devlis-advocated-${Date.now()}.png`);
              }}
              className="flex-1 bg-white/10 text-white hover:bg-white/15"
            >
              Local download
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}
