"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { IconSearch } from "@/components/layout/icons";

const popularQueries = [
  "Area rugs",
  "Runner rugs",
  "Living room",
  "Persian style",
  "Jute rug",
  "Round rug",
];

export function SearchPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q")?.trim() ?? "";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    const next = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
    router.push(next);
  };

  return (
    <div className="flex min-h-full flex-col bg-rc-surface">
      <header className="sticky top-0 z-20 border-b border-rc-border bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-2 py-3">
          <Link
            href="/"
            className="rounded-full p-2.5 text-rc-navy hover:bg-rc-surface"
            aria-label="Back to home"
          >
            <span className="text-lg leading-none" aria-hidden>
              ←
            </span>
          </Link>
          <h1 className="text-lg font-semibold text-rc-navy">Search</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 pb-24 pt-2">
        <form onSubmit={submit} className="px-4 pb-4" role="search">
          <label htmlFor="search-query" className="sr-only">
            Search rugs and carpets
          </label>
          <div className="flex overflow-hidden rounded-xl border border-rc-border bg-white shadow-sm">
            <span className="flex shrink-0 items-center pl-3 text-rc-muted">
              <IconSearch className="h-5 w-5" />
            </span>
            <input
              ref={inputRef}
              id="search-query"
              name="q"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Search for rugs, carpets, sizes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent py-3.5 pl-2 pr-3 text-base text-rc-navy placeholder:text-rc-muted-light outline-none ring-0"
            />
            <button
              type="submit"
              className="shrink-0 bg-rc-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
            >
              Search
            </button>
          </div>
        </form>

        <section className="px-4" aria-labelledby="popular-heading">
          <h2
            id="popular-heading"
            className="text-xs font-semibold uppercase tracking-wide text-rc-muted"
          >
            Popular searches
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {popularQueries.map((label) => (
              <li key={label}>
                <Link
                  href={`/search?q=${encodeURIComponent(label)}`}
                  className="inline-flex rounded-full border border-rc-border bg-white px-3 py-1.5 text-sm text-rc-navy transition-colors hover:border-rc-navy hover:bg-rc-surface"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {qParam ? (
          <section className="mt-10 px-4" aria-live="polite">
            <p className="text-sm text-rc-muted">
              Showing results for{" "}
              <span className="font-medium text-rc-navy">&ldquo;{qParam}&rdquo;</span>
            </p>
            <p className="mt-6 rounded-lg border border-dashed border-rc-border bg-white p-8 text-center text-sm text-rc-muted">
              Product results will appear here when your catalog is connected.
            </p>
          </section>
        ) : null}
      </main>
    </div>
  );
}
