import React, { useEffect, useRef, useState } from "react";
import { NavBar } from "./components/NavBar.jsx";
import { SignInScreen } from "./screens/SignInScreen.jsx";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { SearchScreen } from "./screens/SearchScreen.jsx";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion.js";


const Routes = Object.freeze({
  SIGN_IN: "SIGN_IN",
  HOME: "HOME",
  TV: "TV",
  MOVIES: "MOVIES",
  GAMES: "GAMES",
  SEARCH: "SEARCH",
});

const NAV_ITEMS = [
  { key: Routes.HOME, label: "Home" },
  { key: Routes.TV, label: "TV Shows" },
  { key: Routes.MOVIES, label: "Movies" },
  { key: Routes.GAMES, label: "Video Games" },
];

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // If storage is blocked, we still keep the in-memory state working.
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [auth, setAuth] = useStoredState("auth", { status: "signedOut" });
  const [route, setRoute] = useState(auth.status === "signedIn" ? Routes.HOME : Routes.SIGN_IN);
  const [category, setCategory] = useState(Routes.HOME);
  const [searchOpen, setSearchOpen] = useState(false);

  // Simple transition state for cross-fades between screens.
  const [transitionKey, setTransitionKey] = useState(0);
  const pendingRouteRef = useRef(null);

  function navigate(nextRoute) {
    if (prefersReducedMotion) {
      setRoute(nextRoute);
      setTransitionKey((k) => k + 1);
      return;
    }

    // Small cross-fade: we bump the key immediately, then swap the route shortly after.
    pendingRouteRef.current = nextRoute;
    setTransitionKey((k) => k + 1);
    window.setTimeout(() => {
      if (pendingRouteRef.current) {
        setRoute(pendingRouteRef.current);
        pendingRouteRef.current = null;
      }
    }, 140);
  }

  function onSignedIn(user) {
    setAuth({ status: "signedIn", user });
    navigate(Routes.HOME);
  }

  function onSignOut() {
    setAuth({ status: "signedOut" });
    setSearchOpen(false);
    setCategory(Routes.HOME);
    navigate(Routes.SIGN_IN);
  }

  const userLabel = auth?.user?.mode === "guest" ? "Guest" : auth?.user?.email || "User";

  // Pick which screen to show (simple "router").
  let content = null;
  if (auth.status !== "signedIn") {
    content = <SignInScreen onSignedIn={onSignedIn} />;
  } else if (searchOpen || route === Routes.SEARCH) {
    content = (
      <SearchScreen
        category={category}
        onClose={() => {
          setSearchOpen(false);
          navigate(category);
        }}
      />
    );
  } else {
    content = <HomeScreen category={category} />;
  }

  return (
    <div className="min-h-dvh text-zinc-100">
      {auth.status === "signedIn" ? (
        <NavBar
          items={NAV_ITEMS}
          activeKey={category}
          onSelect={(key) => {
            setCategory(key);
            navigate(key);
          }}
          onSearch={() => {
            setSearchOpen(true);
            navigate(Routes.SEARCH);
          }}
          userLabel={userLabel}
          onSignOut={onSignOut}
        />
      ) : null}

      {/* Cross-fade layer */}
      <main
        key={transitionKey}
        className={
          prefersReducedMotion
            ? "pt-0"
            : "pt-0 animate-[fadeIn_.18s_ease-out] motion-reduce:animate-none"
        }
      >
        {content}
      </main>

  
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
