"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, LockKeyhole, MapPinned } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SavedPlaceCard } from "@/features/saved-places/SavedPlaceCard";
import { SavedPlaceFilters } from "@/features/saved-places/SavedPlaceFilters";
import { savedPlaceStatusValues, type SavedPlaceRecord, type SavedPlaceStatus } from "@/lib/types/domain";

interface SavedPlacesPageProps {
  authRequired: boolean;
  items: SavedPlaceRecord[];
}

export function SavedPlacesPage({ authRequired, items }: SavedPlacesPageProps) {
  const [activeStatus, setActiveStatus] = useState<SavedPlaceStatus | "all">("all");

  const counts = useMemo(
    () =>
      savedPlaceStatusValues.reduce(
        (acc, status) => {
          acc[status] = items.filter((item) => item.status === status).length;
          return acc;
        },
        {} as Record<SavedPlaceStatus, number>,
      ),
    [items],
  );

  const filteredItems = useMemo(() => {
    if (activeStatus === "all") {
      return items;
    }

    return items.filter((item) => item.status === activeStatus);
  }, [activeStatus, items]);

  if (authRequired) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f4f9ff_55%,#ffffff_100%)] px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
          <Card className="w-full max-w-2xl border-white/80 bg-white/90">
            <CardHeader className="space-y-4">
              <Badge className="bg-amber-100 text-amber-700">개인 라이브러리 보호됨</Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  저장한 장소는 로그인 후 확인할 수 있어요
                </h1>
                <p className="text-base leading-7 text-slate-600">
                  검색은 로그인 없이 가능하지만, 내 장소 라이브러리와 trip 출발점은 계정에
                  안전하게 연결됩니다.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-600">
                wishlist / visited / favorite 상태를 누적하고, 나중에 여러 trip에서 재사용할
                수 있는 계정 전체 라이브러리입니다.
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auth/sign-in"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                >
                  <LockKeyhole className="mr-2 size-4" />
                  로그인하러 가기
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-sm font-medium text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  홈에서 장소 탐색 계속하기
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f4f9ff_55%,#ffffff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge className="bg-sky-100 text-sky-700">Account-wide saved places</Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                저장한 장소 라이브러리
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600">
                장소를 먼저 저장하고, 나중에 trip으로 묶는 trip-canvas의 핵심 출발점입니다.
                상태 필터로 정리하고 바로 다음 여행에 재사용할 수 있습니다.
              </p>
            </div>
            <Button className="rounded-2xl">
              <MapPinned className="mr-2 size-4" />
              선택한 장소로 trip 시작
            </Button>
          </div>
          <div className="mt-6">
            <SavedPlaceFilters
              activeStatus={activeStatus}
              counts={counts}
              onStatusChange={setActiveStatus}
            />
          </div>
        </section>

        {filteredItems.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2">
            {filteredItems.map((item) => (
              <SavedPlaceCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <Card className="border-dashed border-slate-200 bg-white/85">
            <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-center">
              <Badge className="bg-slate-100 text-slate-700">비어 있는 상태</Badge>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-950">
                  아직 저장된 장소가 없어요
                </h2>
                <p className="max-w-xl text-sm leading-6 text-slate-600">
                  홈에서 일본 장소를 검색하고 `로그인 후 저장`으로 라이브러리를 채워보세요.
                  이후 여기서 상태별로 정리하고 trip 생성으로 이어질 수 있습니다.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                장소 탐색 시작하기
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
