import React, { useMemo, useState } from "react";

export function SignInScreen({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const emailValid = useMemo(() => {
    return /^\S+@\S+\.\S+$/.test(email.trim());
  }, [email]);

  const canSubmit = emailValid && password.trim().length >= 4;

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_60%_-10%,rgba(239,68,68,0.25),transparent_60%),radial-gradient(900px_500px_at_10%_10%,rgba(59,130,246,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.75),rgba(0,0,0,0.92))]" />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl items-center px-4 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          <div className="self-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
              <span className="grid size-7 place-items-center rounded-full bg-red-600 font-black">B</span>
              <span>Binaire App Assignment</span>
            </div>
            <h1 className="mt-6 text-balance text-4xl font-black tracking-tight sm:text-5xl">
              Browse 10,000+ movies and shows with a Netflix-style UI.
            </h1>
            <p className="mt-4 max-w-prose text-pretty text-zinc-300">
              Sign in (or continue as guest) to explore the movies,
            </p>
            
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur">
              <div className="text-lg font-semibold">Sign in</div>
              <div className="mt-1 text-sm text-zinc-400">Use any demo email.</div>

              <form
                className="mt-5 grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setTouched(true);
                  if (!canSubmit) return;
                  onSignedIn({ mode: "user", email: email.trim() });
                }}
              >
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-300">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-zinc-100 placeholder:text-zinc-500 focus:border-red-500/60 focus:bg-white/7"
                  />
                  {touched && !emailValid ? (
                    <div className="text-xs text-red-300">Enter a valid email.</div>
                  ) : null}
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-300">Password</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched(true)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••"
                    className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-zinc-100 placeholder:text-zinc-500 focus:border-red-500/60 focus:bg-white/7"
                  />
                  {touched && password.trim().length < 4 ? (
                    <div className="text-xs text-red-300">Use 4+ characters (demo UI).</div>
                  ) : null}
                </label>

                <button
                  type="submit"
                  className="mt-2 h-11 rounded-xl bg-red-600 font-semibold text-white shadow-[0_10px_40px_rgba(239,68,68,0.25)] hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!canSubmit}
                >
                  Sign in
                </button>

                <button
                  type="button"
                  className="h-11 rounded-xl border border-white/10 bg-white/5 font-semibold text-zinc-100 hover:bg-white/10"
                  onClick={() => onSignedIn({ mode: "guest" })}
                >
                  Continue as guest
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

