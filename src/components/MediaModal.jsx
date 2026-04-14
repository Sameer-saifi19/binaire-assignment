import React, { useEffect, useMemo } from "react";

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "").trim();
}

export function MediaModal({ item, onClose }) {
  const summary = useMemo(() => stripHtml(item?.summary), [item?.summary]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={item?.name || "Details"}
      onMouseDown={(e) => {
        // Close when clicking the backdrop (not when clicking inside the card).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_40px_150px_rgba(0,0,0,0.7)]">
        <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
          <div className="aspect-16/10 bg-linear-to-br from-white/10 to-white/0 md:aspect-auto">
            {item?.image ? (
              <img src={item.image} alt={item?.name || "Title"} className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-xl font-black tracking-tight">{item?.name}</div>
                <div className="mt-1 text-sm text-zinc-400">
                  {item?.year ? `${item.year}` : "—"}
                  {Array.isArray(item?.genres) && item.genres.length ? `  ·  ${item.genres.join(" • ")}` : ""}
                </div>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            {typeof item?.rating === "number" ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                <span className="text-zinc-400">Rating</span>
                <span className="font-semibold text-white">{item.rating.toFixed(1)}</span>
              </div>
            ) : null}

            {summary ? <p className="mt-4 text-sm leading-6 text-zinc-300">{summary}</p> : null}

            <div className="mt-5 grid gap-2 text-xs text-zinc-500">
              <div>
                <span className="text-zinc-400">ID</span>: {item?.id ?? "—"}
              </div>
              <div>
                <span className="text-zinc-400">Premiered</span>: {item?.premiered ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

