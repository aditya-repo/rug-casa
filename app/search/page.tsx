import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageView } from "@/components/search/SearchPageView";

export const metadata: Metadata = {
  title: "Search — RugCasa",
  description: "Search rugs, carpets, and home décor on RugCasa.",
};

function SearchFallback() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 bg-rc-surface px-4 text-sm text-rc-muted">
      <span className="h-8 w-8 animate-pulse rounded-full bg-rc-border" />
      Opening search…
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageView />
    </Suspense>
  );
}
