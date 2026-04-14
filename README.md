# Movie selection UI (Netflix-style)

Vanilla ES6-compatible **React + Tailwind** storefront UI that loads a large catalog (10k target) with **lazy loading**, **infinite scroll**, **search suggestions**, and **screen transitions**.

## Tech

- **React (ES modules / ES6)**
- **Tailwind CSS** (via `@tailwindcss/vite`)
- **Vite**

## Data source (REST API)

This app uses the public **TVMaze** API (no key required):

- Catalog pages: `https://api.tvmaze.com/shows?page=N`
- Search by name: `https://api.tvmaze.com/search/shows?q=QUERY`

The UI lazily loads pages until it reaches **10,000 items** (or until the API runs out).

## Run

```bash
pnpm install
pnpm dev
```

Build/preview:

```bash
pnpm build
pnpm preview
```

## Features mapped to the assignment

- **Sign-in + guest mode**: `src/screens/SignInScreen.jsx` (demo-only UI, stored in `localStorage`)
- **Home screen**
  - **Today’s top-show** hero: best rated among currently loaded items
  - **Complete list**: infinite scroll grid (loads more as you scroll)
  - **Lazy-loading**: images use native `loading="lazy"`; data loads by sentinel observer
- **Nav categories**: Home, TV shows, Movies, Video-games
  - TVMaze is show-centric; to still implement required tabs, items are deterministically bucketed by ID in `src/hooks/useCatalog.js` (`categoryForItem`)
- **Search view**
  - **Suggestions**: local matches (instant) + server name search
  - **Prevent unnecessary server calls**: debounced input + query cache + `AbortController` cancellation
  - **Search on ID, name, release year**: local filter supports all three; server search is name-based (API limitation)
- **Animations/transitions**: cross-fade between screens + modal transitions (motion-safe)

## Avoiding memory leaks / unnecessary re-renders (what to look at)

- **Abort in-flight fetches** on navigation/changes: `AbortController` cleanup in `src/hooks/useCatalog.js` and `src/screens/SearchScreen.jsx`
- **Disconnect IntersectionObserver** on unmount: `src/hooks/useIntersectionSentinel.js`
- **Prevent excess renders**:
  - append-only state updates for paging
  - `React.memo` for cards/nav (`src/components/MediaCard.jsx`, `src/components/NavBar.jsx`)
