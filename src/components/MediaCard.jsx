import React, { useState } from "react";

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "").trim();
}

// Simple, readable card (no heavy memoization).
export function MediaCard({ item, onOpen }) {
  const [imgErrored, setImgErrored] = useState(false);

  const parts = [];
  if (item?.year) parts.push(item.year);
  if (Array.isArray(item?.genres) && item.genres.length) parts.push(item.genres.slice(0, 2).join(" • "));
  const subtitle = parts.join("  ·  ");

  const summary = stripHtml(item?.summary).slice(0, 140);

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left shadow-[0_20px_80px_rgba(0,0,0,0.4)] transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/7 focus-visible:outline-none motion-reduce:transform-none"
    >
      <div className="aspect-[16/10 w-full overflow-hidden bg-linear-to-br from-white/10 to-white/0">
        {item?.image && !imgErrored ? (
          <img
            src={item.image}
            alt={item?.name || "Title"}
            loading="lazy"
            decoding="async"
            onError={() => setImgErrored(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <div className="text-xs text-zinc-400">No image</div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{item?.name}</div>
            <div className="mt-0.5 truncate text-xs text-zinc-400">{subtitle || "—"}</div>
          </div>
          {typeof item?.rating === "number" ? (
            <div className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-100">
              {item.rating.toFixed(1)}
            </div>
          ) : null}
        </div>
        {summary ? <div className="mt-2 line-clamp-3 text-xs text-zinc-400">{summary}</div> : null}
      </div>
    </button>
  );
}

