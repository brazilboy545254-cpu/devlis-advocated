"use client";

import { useEffect, useState } from "react";
import { Card, GhostButton } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { HistoryItem } from "@/lib/auth";
import { useAuth } from "@/components/use-auth";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";
import { useAppStore } from "@/components/store";

export function HistoryList() {
  const { firebaseUser } = useAuth();
  const locale = useAppStore((s) => s.locale);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!firebaseUser) return;
    setLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch("/api/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error(error);
      toast.error("History could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [firebaseUser]);

  if (loading) {
    return <Card><p className="text-sm text-white/60">Loading history...</p></Card>;
  }

  if (!items.length) {
    return <Card><p className="text-sm text-white/60">{locale === "en" ? "No creations yet." : "अभी तक कोई क्रिएशन नहीं।"}</p></Card>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="grid gap-4 sm:grid-cols-[128px_1fr]">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              {item.signed_urls?.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.signed_urls.preview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-36 items-center justify-center text-white/40">No preview</div>
              )}
            </div>
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.original_name}</h3>
                  <p className="mt-1 text-sm text-white/50">{formatDateTime(item.created_at)}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">#{item.id.slice(0, 8)}</span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-white/70">
                <div><span className="text-white/40">Original:</span> {item.original_name}</div>
                <div><span className="text-white/40">Reference:</span> {item.reference_name}</div>
                <div><span className="text-white/40">Downloads:</span> {item.download_count}</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <GhostButton
                  onClick={async () => {
                    if (!firebaseUser || !item.signed_urls?.result) return;
                    const res = await fetch(item.signed_urls.result);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${item.original_name.replace(/\.[^.]+$/, "")}-devlis.png`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </GhostButton>
                <GhostButton
                  onClick={async () => {
                    if (!firebaseUser) return;
                    const token = await firebaseUser.getIdToken();
                    await fetch(`/api/history/${item.id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Deleted.");
                    load();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </GhostButton>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
