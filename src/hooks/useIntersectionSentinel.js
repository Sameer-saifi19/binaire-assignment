import { useEffect, useRef } from "react";

/**
 * Calls `onIntersect` when the sentinel element becomes visible.
 * Cleans up the observer on unmount to avoid leaks.
 */
export function useIntersectionSentinel({ onIntersect, enabled = true, rootMargin = "800px" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof IntersectionObserver !== "function") return undefined;
    const el = ref.current;
    if (!el) return undefined;

    let cancelled = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (cancelled) return;
        for (const e of entries) {
          if (e.isIntersecting) onIntersect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    obs.observe(el);
    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, [enabled, onIntersect, rootMargin]);

  return ref;
}

