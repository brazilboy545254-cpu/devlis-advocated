"use client";

import { useRef, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Card, GhostButton } from "@/components/ui";

type Props = {
  label: string;
  hint: string;
  accept?: string;
  onFile: (file: File | null, preview: string | null) => void;
};

export function FileDropzone({ label, hint, accept = "image/*", onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <Card className="group relative overflow-hidden p-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_35%)]" />
      <div className="relative p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">{label}</div>
            <div className="mt-1 text-xs text-white/50">{hint}</div>
          </div>
          <ImageIcon className="h-5 w-5 text-cyan-300/80" />
        </div>

        <div className="overflow-hidden rounded-[24px] border border-dashed border-white/10 bg-black/20 p-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={label} className="h-44 w-full rounded-2xl object-cover" />
          ) : (
            <div className="flex h-44 items-center justify-center rounded-2xl bg-white/[0.03] text-center">
              <div>
                <Upload className="mx-auto h-8 w-8 text-white/30" />
                <p className="mt-3 text-sm text-white/55">Drag, drop, or browse</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (!file) {
                setPreview(null);
                onFile(null, null);
                return;
              }
              const url = URL.createObjectURL(file);
              setPreview(url);
              onFile(file, url);
            }}
          />
          <GhostButton onClick={() => inputRef.current?.click()}>Choose file</GhostButton>
          {preview ? (
            <GhostButton
              onClick={() => {
                setPreview(null);
                onFile(null, null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Clear
            </GhostButton>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
