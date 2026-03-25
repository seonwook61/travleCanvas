"use client";

import { Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlaceSearchBoxProps {
  quickCities: string[];
  query: string;
  selectedCity: string;
  isSearching: boolean;
  onQueryChange: (nextQuery: string) => void;
  onSearch: () => void;
  onQuickCitySearch: (city: string) => void;
}

export function PlaceSearchBox({
  quickCities,
  query,
  selectedCity,
  isSearching,
  onQueryChange,
  onSearch,
  onQuickCitySearch,
}: PlaceSearchBoxProps) {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/90 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {quickCities.map((city) => (
          <Button
            key={city}
            type="button"
            variant={city === selectedCity ? "primary" : "secondary"}
            className="rounded-full"
            onClick={() => onQuickCitySearch(city)}
          >
            {city}
          </Button>
        ))}
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          <Sparkles className="size-3.5" />
          주요 도시 우선 추천
        </span>
      </div>
      <form
        className="flex flex-col gap-3 lg:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <label className="sr-only" htmlFor="place-search">
          장소 검색
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="place-search"
            className="pl-10"
            placeholder="도쿄, 오사카, 교토 장소 검색"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
        <Button className="h-11 px-5" type="submit" disabled={isSearching}>
          {isSearching ? "찾는 중..." : "장소 찾기"}
        </Button>
      </form>
    </div>
  );
}
