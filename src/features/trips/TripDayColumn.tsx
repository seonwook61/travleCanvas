"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatTripDayLabel } from "@/lib/trips/trip-utils";
import type { SavedPlaceRecord, TripDayRecord } from "@/lib/types/domain";

interface TripDayColumnProps {
  day: TripDayRecord;
  savedPlaces: SavedPlaceRecord[];
  isSubmitting: boolean;
  onAddItem: (payload: { tripDayId: string; savedPlaceId: string; note: string }) => Promise<void>;
}

export function TripDayColumn({
  day,
  savedPlaces,
  isSubmitting,
  onAddItem,
}: TripDayColumnProps) {
  const availablePlaces = useMemo(
    () =>
      savedPlaces.filter(
        (place) => !day.items.some((item) => item.savedPlaceId === place.id),
      ),
    [day.items, savedPlaces],
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState(availablePlaces[0]?.id ?? "");
  const [note, setNote] = useState("");

  return (
    <Card className="border-white/70 bg-white/90">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-sky-700">
              {formatTripDayLabel(day.tripDate, day.dayNumber)}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-950">Day {day.dayNumber}</h3>
          </div>
          <Badge className="bg-slate-100 text-slate-700">{day.items.length}개 배치</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {day.items.length > 0 ? (
          <div className="space-y-3">
            {day.items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p className="font-medium text-slate-900">
                  {item.savedPlace?.name ?? item.savedPlaceId}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.savedPlace ? `${item.savedPlace.city} · ${item.savedPlace.region}` : "장소 정보"}
                </p>
                {item.note ? (
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500">
            아직 이 날에 배치된 장소가 없습니다.
          </div>
        )}

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-sm font-medium text-slate-700">saved place를 이 날에 담기</p>
          {availablePlaces.length > 0 ? (
            <>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">장소 선택</span>
                <select
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  value={selectedPlaceId}
                  disabled={isSubmitting}
                  onChange={(event) => setSelectedPlaceId(event.target.value)}
                >
                  {availablePlaces.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.name} · {place.city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">짧은 메모</span>
                <textarea
                  className="min-h-[88px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="예) 첫날 오후에 들르기"
                  value={note}
                  disabled={isSubmitting}
                  onChange={(event) => setNote(event.target.value)}
                />
              </label>
              <Button
                className="w-full rounded-2xl"
                disabled={!selectedPlaceId || isSubmitting}
                onClick={async () => {
                  await onAddItem({
                    tripDayId: day.id,
                    savedPlaceId: selectedPlaceId,
                    note,
                  });
                  setNote("");
                }}
              >
                <Plus className="mr-2 size-4" />
                itinerary에 추가
              </Button>
            </>
          ) : (
            <p className="text-sm leading-6 text-slate-500">
              이 날에 담을 수 있는 saved place를 모두 배치했습니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
