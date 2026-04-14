import React from "react";

// Simple, readable nav bar.
export function NavBar({ items, activeKey, onSelect, onSearch, userLabel, onSignOut }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-linear-to-b from-black/85 to-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="./Netflix.png" alt="" className="h-10 w-10" />
        </div>

        <nav className="ml-2 hidden flex-1 items-center gap-1 md:flex" aria-label="Primary">
          {items.map((it) => {
            const active = it.key === activeKey;
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onSelect(it.key)}
                className={
                  active
                    ? "rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                }
              >
                {it.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Search
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-xs text-zinc-400">Signed in:</div>
            <div className="text-sm font-medium">{userLabel}</div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {items.map((it) => {
          const active = it.key === activeKey;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onSelect(it.key)}
              className={
                active
                  ? "shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                  : "shrink-0 rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
              }
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
