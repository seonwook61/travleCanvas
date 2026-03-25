import { CalendarDays, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatTripDayLabel } from "@/lib/trips/trip-utils";
import type { SharedTripDayRecord } from "@/lib/share/get-shared-trip-detail";

interface RouteBoardSectionProps {
  days: SharedTripDayRecord[];
}

export function RouteBoardSection({ days }: RouteBoardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <Badge className="bg-sky-100 text-sky-700">루트 보드</Badge>
        <p className="text-sm leading-6 text-slate-600">
          실제 날짜와 Day 표기를 함께 보여주는 가벼운 itinerary입니다. 시간 단위 최적화보다,
          어떤 장소를 어떤 날에 둘지 빠르게 공유하는 데 집중합니다.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {days.map((day) => (
          <Card key={day.id} className="border-slate-200 bg-white/90">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-sky-700">
                    {formatTripDayLabel(day.tripDate, day.dayNumber)}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-950">
                    Day {day.dayNumber} itinerary
                  </h3>
                </div>
                <div className="rounded-full bg-slate-100 p-2 text-slate-500">
                  <CalendarDays className="size-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {day.items.length > 0 ? (
                <ol className="space-y-3">
                  {day.items.map((item, index) => (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
                          {index + 1}
                        </div>
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-slate-950">
                              {item.savedPlace?.name ?? "장소 정보 없음"}
                            </p>
                            {item.savedPlace?.city ? (
                              <Badge className="bg-white text-slate-700 ring-1 ring-slate-200">
                                {item.savedPlace.city}
                              </Badge>
                            ) : null}
                          </div>
                          {item.savedPlace?.formattedAddress ? (
                            <p className="text-sm text-slate-500">
                              {item.savedPlace.formattedAddress}
                            </p>
                          ) : null}
                          {item.note ? (
                            <div className="rounded-2xl border border-dashed border-sky-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700">
                              <Route className="mr-2 inline size-4 text-sky-600" />
                              {item.note}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-500">
                  아직 공유된 일정 카드가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
