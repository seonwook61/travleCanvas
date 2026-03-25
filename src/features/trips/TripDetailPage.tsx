"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TripDayColumn } from "@/features/trips/TripDayColumn";
import type {
  ItineraryItemRecord,
  SavedPlaceRecord,
  TripDayRecord,
  TripRecord,
} from "@/lib/types/domain";

interface TripDetailPageProps {
  authRequired: boolean;
  trip: TripRecord | null;
  tripDays: TripDayRecord[];
  savedPlaces: SavedPlaceRecord[];
}

export function TripDetailPage({
  authRequired,
  trip,
  tripDays,
  savedPlaces,
}: TripDetailPageProps) {
  const [days, setDays] = useState(tripDays);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPlaced = useMemo(
    () => days.reduce((sum, day) => sum + day.items.length, 0),
    [days],
  );

  async function handleAddItem(payload: {
    tripDayId: string;
    savedPlaceId: string;
    note: string;
  }) {
    if (!trip) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/trips/${trip.id}/itinerary-items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("itinerary item 추가 실패");
      }

      const result = (await response.json()) as {
        item?: { id: string; savedPlaceId: string; tripDayId: string; note: string | null; sortOrder: number };
      };

      if (!result.item) {
        throw new Error("itinerary item 응답이 비어 있습니다.");
      }

      const selectedPlace = savedPlaces.find((place) => place.id === result.item?.savedPlaceId);
      const nextItem: ItineraryItemRecord = {
        id: result.item.id,
        tripDayId: result.item.tripDayId,
        savedPlaceId: result.item.savedPlaceId,
        note: result.item.note,
        sortOrder: result.item.sortOrder,
        savedPlace: selectedPlace,
      };

      setDays((currentDays) =>
        currentDays.map((day) =>
          day.id === payload.tripDayId
            ? {
                ...day,
                items: [...day.items, nextItem],
              }
            : day,
        ),
      );
    } catch {
      setError("일정 배치에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authRequired) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f4f9ff_55%,#ffffff_100%)] px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
          <Card className="w-full max-w-2xl border-white/80 bg-white/90">
            <CardHeader className="space-y-4">
              <Badge className="bg-amber-100 text-amber-700">trip detail 보호됨</Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                로그인 후 trip itinerary를 편집할 수 있어요
              </h1>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-slate-600">
                날짜별 배치와 공유 링크 생성은 로그인 후 개인 여행 문맥 안에서만 동작합니다.
              </p>
              <Link
                href="/auth/sign-in"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <LockKeyhole className="mr-2 size-4" />
                로그인하고 이어가기
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f4f9ff_55%,#ffffff_100%)] px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
          <Card className="w-full max-w-2xl border-white/80 bg-white/90">
            <CardContent className="space-y-4 py-10 text-center">
              <Badge className="bg-slate-100 text-slate-700">trip 없음</Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                아직 이 trip을 찾지 못했어요
              </h1>
              <Link
                href="/trips/new"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                새 trip 만들기
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f4f9ff_55%,#ffffff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge className="bg-sky-100 text-sky-700">dated itinerary</Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                {trip.title}
              </h1>
              <p className="text-base leading-7 text-slate-600">
                {trip.startDate}부터 {trip.endDate}까지, 실제 날짜 기반으로 장소를 배치하는
                trip canvas입니다.
              </p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/75 px-5 py-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-5 text-sky-600" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{days.length}일 일정</p>
                  <p className="text-sm text-slate-500">{totalPlaced}개 장소 배치 완료</p>
                </div>
              </div>
            </div>
          </div>
          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {days.map((day) => (
            <TripDayColumn
              key={day.id}
              day={day}
              savedPlaces={savedPlaces}
              isSubmitting={isSubmitting}
              onAddItem={handleAddItem}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
