import React, { useState } from "react";
import { MediaCard } from "../components/MediaCard.jsx";
import { MediaModal } from "../components/MediaModal.jsx";
import { useCatalog, categoryForItem } from "../hooks/useCatalog.js";
import { useIntersectionSentinel } from "../hooks/useIntersectionSentinel.js";

function titleForCategory(category) {
  if (category === "TV") return "TV Shows";
  if (category === "MOVIES") return "Movies";
  if (category === "GAMES") return "Video Games";
  return "Home";
}

export function HomeScreen({ category }) {
  const { items, status, totalLoaded, loadNextPage, topShow } = useCatalog({ targetCount: 10_000 });
  const [openItem, setOpenItem] = useState(null);

  const filtered =
    category === "HOME" ? items : items.filter((it) => categoryForItem(it) === category);

  function onOpen(it) {
    setOpenItem(it);
  }

  const canLoadMore = status.kind !== "done" && status.kind !== "error";
  const sentinelRef = useIntersectionSentinel({
    enabled: canLoadMore,
    onIntersect: () => loadNextPage(),
    rootMargin: "900px",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-14">
      {/* Hero */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(239,68,68,0.22),transparent_55%)]" />
        <div className="relative grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
              <span className="inline-block size-2 rounded-full bg-red-500" />
              Today’s top-show
            </div>
            <div className="mt-4 text-balance text-3xl font-black tracking-tight sm:text-4xl">
              {topShow?.name || "Loading…"}
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              {typeof topShow?.rating === "number" ? (
                <span className="mr-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                  <span className="text-zinc-400">Rating</span>
                  <span className="font-semibold text-white">{topShow.rating.toFixed(1)}</span>
                </span>
              ) : null}
              <span className="text-zinc-400">
                Loaded: <span className="text-zinc-200 font-medium">{totalLoaded.toLocaleString()}</span> /{" "}
                10,000
              </span>
            </div>
            <p className="mt-4 max-w-prose text-pretty text-sm leading-6 text-zinc-300">
              Scroll to load more titles (infinite scrolling). Images are lazy-loaded
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                onClick={() => topShow && onOpen(topShow)}
                disabled={!topShow}
              >
                View details
              </button>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
                onClick={() => loadNextPage()}
              >
                Load more
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              {topShow?.image ? (
                <img
                  src={topShow.image}
                  alt={topShow?.name || "Top show"}
                  className="aspect-16/10 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="grid aspect-16/10 place-items-center text-sm text-zinc-400">
                  Loading artwork…
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Title + status */}
      <section className="mt-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{titleForCategory(category)}</h2>
          <div className="mt-1 text-xs text-zinc-400">
            Showing{" "}
            <span className="font-medium text-zinc-200">{filtered.length.toLocaleString()}</span>{" "}
            items (loaded so far)
          </div>
        </div>

        <div className="text-xs text-zinc-400">
          {status.kind === "loading" ? "Loading more…" : null}
          {status.kind === "done" ? "All available pages loaded." : null}
          {status.kind === "error" ? (
            <span className="text-red-300">Error: {status.message}</span>
          ) : null}
        </div>
      </section>

      {/* Grid */}
      <section className="mt-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((it) => (
            <MediaCard key={it.id} item={it} onOpen={setOpenItem} />
          ))}
        </div>

  
        <div ref={sentinelRef} className="h-14" />
      </section>

      <MediaModal item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  );
}

