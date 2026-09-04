"use client";

// GIF/sticker picker, powered by GIPHY. Sits alongside the plain "Image"
// button on every image container that takes a single image (story cover,
// story body image blocks, newsletter header).
//
// Single-select by design — these containers hold exactly one image, so
// there's no multi-pick "Attach" step. Clicking a tile immediately fetches
// that GIF/sticker's bytes client-side (GIPHY's CDN serves permissive CORS)
// and hands the caller a real File — the same shape a <input type="file">
// pick produces — so it flows through each container's existing
// onFilePicked → deferred-upload-on-save pipeline untouched. The result is
// a normal Cloudinary asset like any other image, not a hotlinked GIPHY URL.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Search, Sticker as StickerIcon } from "lucide-react";
import { toast } from "sonner";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { fetchTrending, searchGiphy, isGiphyConfigured, type GiphyItem } from "@/lib/giphy";

type Kind = "gifs" | "stickers";

const SEARCH_DEBOUNCE_MS = 400;

async function toFile(item: GiphyItem): Promise<File> {
  const res = await fetch(item.fullUrl);
  if (!res.ok) throw new Error(`Failed to fetch media (${res.status})`);
  const blob = await res.blob();
  const ext = blob.type === "image/webp" ? "webp" : "gif";
  return new File([blob], `giphy-${item.id}.${ext}`, { type: blob.type || "image/gif" });
}

export default function GifStickerPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  /** Fires with a real File once a tile finishes fetching — feed it straight
   * into the same onFilePicked the container already uses for uploads. */
  onPick: (file: File) => void;
}) {
  const [kind, setKind] = useState<Kind>("gifs");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<GiphyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [pickingId, setPickingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEscapeKey(onClose, open);

  const load = async (nextKind: Kind, nextQuery: string) => {
    if (!isGiphyConfigured) return;
    setLoading(true);
    setErrored(false);
    try {
      const results = nextQuery.trim()
        ? await searchGiphy(nextKind, nextQuery.trim())
        : await fetchTrending(nextKind);
      setItems(results);
    } catch {
      setErrored(true);
    } finally {
      setLoading(false);
    }
  };

  // Reset to a clean slate each time the picker opens, and load trending
  // right away so there's something to see before typing anything.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setKind("gifs");
    setPickingId(null);
    void load("gifs", "");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void load(kind, query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [kind, query, open]);

  if (!open) return null;

  const handlePick = async (item: GiphyItem) => {
    if (pickingId) return;
    setPickingId(item.id);
    try {
      const file = await toFile(item);
      onPick(file);
      onClose();
    } catch {
      toast.error("Couldn't load that one — try again.");
      setPickingId(null);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-[80vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.2)] dark:bg-[#1a1f2e] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 p-5 pb-4 dark:border-slate-700">
          <StickerIcon size={18} className="text-primary dark:text-[#93b8f0]" />
          <h2 className="text-lg font-bold text-[#0f1e3d] dark:text-gray-50">GIFs &amp; Stickers</h2>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="ml-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        {!isGiphyConfigured ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <StickerIcon size={32} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              GIF &amp; sticker search isn&apos;t set up yet.
            </p>
          </div>
        ) : (
          <>
            {/* Tabs + search */}
            <div className="flex shrink-0 flex-col gap-3 p-5 pb-0">
              <div className="flex gap-2">
                {(["gifs", "stickers"] as Kind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-bold capitalize transition-colors ${
                      kind === k
                        ? "border-primary bg-primary text-white"
                        : "border-secondary bg-secondary/20 text-primary hover:bg-secondary/40 dark:border-[#2a4a7a] dark:bg-[#1e3a5f]/30 dark:text-[#93b8f0] dark:hover:bg-[#1e3a5f]/60"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-xl border-2 border-secondary bg-[#F0F5FF] px-3 dark:border-[#2a4a7a] dark:bg-[#1e2a3a]">
                <Search size={16} className="shrink-0 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${kind}…`}
                  maxLength={50}
                  className="w-full bg-transparent py-2.5 text-sm text-[#0f1e3d] outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Grid */}
            <div className={`mt-4 min-h-0 flex-1 overflow-y-auto px-5 pb-5 ${pickingId ? "pointer-events-none" : ""}`}>
              {errored ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Couldn&apos;t load results — check your connection and try again.
                  </p>
                </div>
              ) : loading ? (
                <div className="columns-2 gap-2 sm:columns-3">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="mb-2 h-28 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-[#2d3748]" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No results found.</p>
                </div>
              ) : (
                <div className="columns-2 gap-2 sm:columns-3">
                  {items.map((item) => {
                    const isPicking = pickingId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handlePick(item)}
                        disabled={!!pickingId}
                        className="relative mb-2 block w-full cursor-pointer overflow-hidden rounded-xl transition active:scale-95 disabled:cursor-default"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.previewUrl}
                          alt={item.description}
                          loading="lazy"
                          style={item.width && item.height ? { aspectRatio: `${item.width} / ${item.height}` } : undefined}
                          className="block w-full rounded-xl bg-slate-100 object-cover dark:bg-[#2d3748]"
                        />
                        {isPicking && (
                          <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-700">
              <span className="text-[11px] text-gray-400 dark:text-gray-500">Powered by GIPHY</span>
              {pickingId && (
                <span className="text-xs font-semibold text-primary dark:text-[#93b8f0]">Adding…</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
