"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Heart, MapPinned, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapCanvas } from "@/features/map-home/MapCanvas";
import { PlaceSearchBox } from "@/features/map-home/PlaceSearchBox";
import type { NormalizedPlaceResult } from "@/lib/types/domain";

const cityChips = ["도쿄", "오사카", "교토"];
const saveStatuses = [
  { label: "가고 싶음", count: 0 },
  { label: "다녀옴", count: 0 },
  { label: "즐겨찾기", count: 0 },
];

interface SearchResponse {
  items: NormalizedPlaceResult[];
  meta: {
    source: "fallback" | "google";
    query: string;
    city: string | null;
    region: string | null;
  };
}

export function MapHomePage() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("도쿄");
  const [results, setResults] = useState<NormalizedPlaceResult[]>([]);
  const [searchSource, setSearchSource] = useState<"fallback" | "google">("fallback");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (nextQuery: string, nextCity: string) => {
    setIsSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (nextQuery.trim()) {
        params.set("q", nextQuery.trim());
      }

      if (nextCity.trim()) {
        params.set("city", nextCity.trim());
      }

      const response = await fetch(`/api/places/search?${params.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("장소 검색 응답을 불러오지 못했습니다.");
      }

      const payload = (await response.json()) as SearchResponse;

      setResults(payload.items);
      setSearchSource(payload.meta.source);
    } catch {
      setResults([]);
      setSearchSource("fallback");
      setError("검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    void runSearch("", "도쿄");
  }, [runSearch]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f4f9ff_50%,#ffffff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[36px] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge className="bg-sky-100 text-sky-700">저장 중심 일본 여행 앱</Badge>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                trip-canvas
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                장소를 먼저 저장하고, 나중에 trip으로 묶고, 가벼운 day-by-day itinerary로
                정리한 뒤 읽기 전용 링크로 공유하세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {cityChips.map((city) => (
                <Button
                  key={city}
                  variant={city === selectedCity ? "primary" : "secondary"}
                  onClick={() => {
                    setSelectedCity(city);
                    void runSearch(query, city);
                  }}
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <PlaceSearchBox
              quickCities={cityChips}
              query={query}
              selectedCity={selectedCity}
              isSearching={isSearching}
              onQueryChange={setQuery}
              onSearch={() => {
                void runSearch(query, selectedCity);
              }}
              onQuickCitySearch={(city) => {
                setSelectedCity(city);
                void runSearch(query, city);
              }}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="bg-white/90">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-700">저장한 장소</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">개인 라이브러리</h2>
                </div>
                <Heart className="size-5 text-rose-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {saveStatuses.map((status) => (
                  <div
                    key={status.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{status.label}</span>
                      <span className="text-sm text-slate-400">{status.count}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-5 text-sm leading-6 text-slate-500">
                로그인 후 저장한 장소가 여기에 쌓이고, 이후 trip 생성과 공유의 출발점이 됩니다.
              </div>

              <Button variant="ghost" className="w-full justify-between rounded-2xl">
                저장 흐름 살펴보기
                <ChevronRight className="size-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <MapCanvas
              error={error}
              isSearching={isSearching}
              results={results}
              searchSource={searchSource}
              selectedCity={selectedCity}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Trip 생성</p>
                    <h3 className="mt-1 text-lg font-semibold">저장 후 일정으로 승격</h3>
                  </div>
                  <Route className="size-5 text-emerald-500" />
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-600">
                  저장한 장소를 선택해서 여행을 만들고, 날짜별로 가볍게 배치하는 흐름을
                  기본 전제로 둡니다.
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">공유 링크</p>
                    <h3 className="mt-1 text-lg font-semibold">읽기 전용 여행 상세</h3>
                  </div>
                  <MapPinned className="size-5 text-amber-500" />
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-600">
                  메인 앱은 작업 중심, 공유 페이지는 핀보드 컬렉션과 루트 보드가 섞인 감성형
                  읽기 전용 레이아웃으로 이어집니다.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
