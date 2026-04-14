import React, { useEffect, useMemo, useRef, useState } from "react";
import { MediaCard } from "../components/MediaCard.jsx";
import { MediaModal } from "../components/MediaModal.jsx";
import { useCatalog, categoryForItem } from "../hooks/useCatalog.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { searchShowsByName, toErrorMessage } from "../lib/tvmaze.js";

function parseYear(s) {
  const n = Number(String(s).trim());
  if (!Number.isFinite(n)) return null;
  if (n < 1900 || n > 2100) return null;
  return n;
}

function normalizeText(s) {
  return String(s || "").toLowerCase();
}

export function SearchScreen({ category, onClose }) {
  const { items } = useCatalog({ targetCount: 10_000 });
  const [openItem, setOpenItem] = useState(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);

  const [remoteStatus, setRemoteStatus] = useState({ kind: "idle" }); // idle | loading | error
  const [remoteSuggestions, setRemoteSuggestions] = useState([]);

  const abortRef = useRef(null);
  const cacheRef = useRef(new Map()); // query -> suggestions

  // Local suggestions: instant, no server calls.
  const localResults = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q) return [];

    const qLower = normalizeText(q);
    const qYear = parseYear(q);
    const qId = Number(q);
    const hasNumeric = Number.isFinite(qId);

    const results = [];
    for (const it of items) {
      if (!it) continue;
      if (category !== "HOME" && categoryForItem(it) !== category) continue;

      const nameMatch = normalizeText(it.name).includes(qLower);
      const yearMatch = qYear ? it.year === qYear : false;
      const idMatch = hasNumeric ? it.id === qId : false;

      if (nameMatch || yearMatch || idMatch) results.push(it);
      if (results.length >= 40) break; // keep UI snappy
    }
    return results;
  }, [category, debouncedQuery, items]);

  useEffect(() => {
    const q = debouncedQuery.trim();

    // Prevent unnecessary calls:
    // - only call server for "name-like" queries (length >= 2)
    // - cache results for repeat queries
    // - abort previous request when query changes quickly (avoids leaks + wasted work)
    if (q.length < 2) {
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    const cached = cacheRef.current.get(q.toLowerCase());
    if (cached) {
      setRemoteSuggestions(cached);
      setRemoteStatus({ kind: "idle" });
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRemoteStatus({ kind: "loading" });

    (async () => {
      try {
        const data = await searchShowsByName(q, { signal: controller.signal });
        const mapped = data
          .map((show) => ({
            id: show?.id ?? null,
            name: show?.name ?? "Untitled",
            year: show?.premiered ? Number(String(show.premiered).slice(0, 4)) : null,
            premiered: show?.premiered ?? null,
            image: show?.image?.original || show?.image?.medium || null,
            genres: Array.isArray(show?.genres) ? show.genres : [],
            rating: show?.rating?.average ?? null,
            summary: show?.summary ?? "",
            raw: show,
          }))
          .filter((it) => it.id);

        cacheRef.current.set(q.toLowerCase(), mapped);
        setRemoteSuggestions(mapped);
        setRemoteStatus({ kind: "idle" });
      } catch (err) {
        if (err?.name === "AbortError") return;
        setRemoteStatus({ kind: "error", message: toErrorMessage(err) });
      }
    })();

    return () => controller.abort();
  }, [debouncedQuery]);

  const merged = useMemo(() => {
    // Merge local + remote without duplicates, then apply category filter.
    const seen = new Set();
    const out = [];

    const push = (it) => {
      if (!it?.id || seen.has(it.id)) return;
      if (category !== "HOME" && categoryForItem(it) !== category) return;
      seen.add(it.id);
      out.push(it);
    };

    for (const it of localResults) push(it);
    if (debouncedQuery.trim().length >= 2) {
      for (const it of remoteSuggestions) push(it);
    }

    return out.slice(0, 80);
  }, [category, debouncedQuery, localResults, remoteSuggestions]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-14">
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Search</h2>
          <div className="mt-1 text-xs text-zinc-400">
            Search by <span className="text-zinc-200 font-medium">ID</span>,{" "}
            <span className="text-zinc-200 font-medium">name</span>, or{" "}
            <span className="text-zinc-200 font-medium">release year</span>.
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
        >
          Back
        </button>
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-zinc-200">Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 1, Batman, 2016…"
            className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-zinc-100 placeholder:text-zinc-500 focus:border-red-500/60 focus:bg-white/7"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <div>
            Showing <span className="text-zinc-200 font-medium">{merged.length}</span> results
          </div>
          <div>
            {remoteStatus.kind === "loading" ? "Fetching suggestions…" : null}
            {remoteStatus.kind === "error" ? (
              <span className="text-red-300">Server error: {remoteStatus.message}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {merged.map((it) => (
          <MediaCard key={it.id} item={it} onOpen={setOpenItem} />
        ))}
      </div>

      <MediaModal item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  );
}

