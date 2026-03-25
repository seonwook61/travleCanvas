import Link from "next/link";
import { Compass, CopyCheck, Mailbox, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PinboardSection } from "@/features/share/PinboardSection";
import { RouteBoardSection } from "@/features/share/RouteBoardSection";
import type { SharedTripDetail } from "@/lib/share/get-shared-trip-detail";

interface SharedTripPageProps {
  detail: SharedTripDetail;
}

export function SharedTripPage({ detail }: SharedTripPageProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fdf7ea_0%,#f7fbff_45%,#ffffff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[40px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute right-6 top-6 hidden rounded-full border border-dashed border-amber-300 bg-amber-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 md:block">
            postcard stamp
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <Badge className="bg-emerald-100 text-emerald-700">읽기 전용 여행 공유</Badge>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                  {detail.trip.title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600">
                  {detail.trip.startDate}부터 {detail.trip.endDate}까지의 여정을 장소 컬렉션과
                  날짜 기반 루트 보드로 함께 보여주는 공유 페이지입니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <div className="rounded-full bg-slate-100 px-4 py-2">
                  하이라이트 {detail.savedPlaceHighlights.length}개
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2">
                  Day 구간 {detail.tripDays.length}개
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2">
                  permission: {detail.shareLink.permission}
                </div>
              </div>
            </div>

            <Card className="border-slate-200 bg-[linear-gradient(180deg,#fffaf2_0%,#ffffff_100%)]">
              <CardHeader className="space-y-3">
                <Badge className="w-fit bg-sky-100 text-sky-700">share summary</Badge>
                <h2 className="text-2xl font-semibold text-slate-950">
                  저장 중심 여행 보드
                </h2>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
                <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200">
                  <Compass className="mt-0.5 size-4 shrink-0 text-sky-600" />
                  일본 전역 장소 검색 결과를 저장하고, 주요 도시 여행 흐름으로 묶는 구조입니다.
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200">
                  <Route className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  itinerary는 가볍게 유지하고, 공유는 편집이 아닌 읽기 전용으로만 노출됩니다.
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200">
                  <CopyCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  링크는 사용자가 직접 만들 때만 발급되며, 기본 상태는 비공개입니다.
                </div>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                >
                  <Mailbox className="mr-2 size-4" />
                  trip-canvas 홈으로 이동
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <PinboardSection items={detail.savedPlaceHighlights} />
        <RouteBoardSection days={detail.tripDays} />
      </div>
    </main>
  );
}
