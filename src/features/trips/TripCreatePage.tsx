"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, LockKeyhole, MapPinned } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SavedPlaceRecord } from "@/lib/types/domain";

interface TripCreatePageProps {
  authRequired: boolean;
  savedPlaces: SavedPlaceRecord[];
}

export function TripCreatePage({ authRequired, savedPlaces }: TripCreatePageProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("2026-04-17");
  const [endDate, setEndDate] = useState("2026-04-20");
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCount = selectedPlaceIds.length;
  const hasSavedPlaces = savedPlaces.length > 0;
  const isDisabled = authRequired || isSubmitting;

  const helperCopy = useMemo(() => {
    if (authRequired) {
      return "로그인 후 trip 생성이 가능하지만, 지금도 화면 구조와 입력 흐름은 미리 확인할 수 있습니다.";
    }

    if (!hasSavedPlaces) {
      return "아직 saved places가 없어요. 홈에서 장소를 저장한 뒤 다시 돌아오면 선택할 수 있습니다.";
    }

    return "saved places에서 장소를 골라 실제 날짜 기반 itinerary의 출발점을 만드세요.";
  }, [authRequired, hasSavedPlaces]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (authRequired) {
      router.push("/auth/sign-in");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
          selectedPlaceIds,
        }),
      });

      if (!response.ok) {
        throw new Error("trip을 만들지 못했습니다.");
      }

      const payload = (await response.json()) as { trip?: { id: string } };

      if (!payload.trip?.id) {
        throw new Error("trip 생성 응답이 올바르지 않습니다.");
      }

      router.push(`/trips/${payload.trip.id}`);
    } catch {
      setError("trip 생성에 실패했습니다. 입력값을 확인하고 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f4f9ff_55%,#ffffff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="space-y-3">
            <Badge className="bg-emerald-100 text-emerald-700">dated itinerary builder</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              새 trip 만들기
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">{helperCopy}</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="border-white/70 bg-white/90">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-700">trip 기본 정보</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    실제 날짜 기반으로 시작하기
                  </h2>
                </div>
                <CalendarDays className="size-5 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="trip-title" className="text-sm font-medium text-slate-700">
                    trip 제목
                  </label>
                  <input
                    id="trip-title"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                    placeholder="예) 간사이 봄 여행"
                    value={title}
                    disabled={isDisabled}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="trip-start-date" className="text-sm font-medium text-slate-700">
                      시작일
                    </label>
                    <input
                      id="trip-start-date"
                      type="date"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                      value={startDate}
                      disabled={isDisabled}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="trip-end-date" className="text-sm font-medium text-slate-700">
                      종료일
                    </label>
                    <input
                      id="trip-end-date"
                      type="date"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                      value={endDate}
                      disabled={isDisabled}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">saved places에서 가져온 후보</p>
                    <Badge className="bg-slate-100 text-slate-700">{selectedCount}개 선택</Badge>
                  </div>
                  {hasSavedPlaces ? (
                    <div className="grid gap-3 rounded-3xl bg-slate-50 p-4">
                      {savedPlaces.map((place) => (
                        <label
                          key={place.id}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4"
                        >
                          <input
                            type="checkbox"
                            className="mt-1 size-4 rounded border-slate-300"
                            checked={selectedPlaceIds.includes(place.id)}
                            disabled={isDisabled}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setSelectedPlaceIds((current) => [...current, place.id]);
                                return;
                              }

                              setSelectedPlaceIds((current) =>
                                current.filter((currentId) => currentId !== place.id),
                              );
                            }}
                          />
                          <div className="space-y-1">
                            <p className="font-medium text-slate-900">{place.name}</p>
                            <p className="text-sm text-slate-500">
                              {place.city} · {place.region}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-600">
                      아직 선택 가능한 saved places가 없습니다. 홈에서 장소를 저장하면 여기에
                      후보로 나타납니다.
                    </div>
                  )}
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" className="rounded-2xl" disabled={isDisabled}>
                    {authRequired ? "로그인 후 trip 만들기" : isSubmitting ? "생성 중..." : "trip 만들기"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-2xl"
                    onClick={() => router.push("/saved")}
                  >
                    saved places 보러 가기
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/90">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">planning preview</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">trip이 만들어진 뒤</h2>
                </div>
                <MapPinned className="size-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                `2026-04-17 (Day 1)` 같은 실제 날짜 레이블이 자동으로 생성되고, 이후 day별로
                saved places를 배치해 가벼운 itinerary를 구성합니다.
              </div>

              {authRequired ? (
                <Link
                  href="/auth/sign-in"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                >
                  <LockKeyhole className="mr-2 size-4" />
                  로그인하고 이어가기
                </Link>
              ) : (
                <Link
                  href="/saved"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-sm font-medium text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  saved places 정리하기
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
