import { MapPinned, Stamp, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SharedPlaceRecord } from "@/lib/share/get-shared-trip-detail";

interface PinboardSectionProps {
  items: SharedPlaceRecord[];
}

export function PinboardSection({ items }: PinboardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-amber-100 text-amber-700">저장한 장소 하이라이트</Badge>
          <p className="text-sm leading-6 text-slate-600">
            trip에 담기 전부터 쌓아 둔 개인 라이브러리 중, 이번 여행에 실제로 등장하는 장소만
            엄선해서 보여줍니다.
          </p>
        </div>
        <div className="hidden rounded-full bg-slate-100 p-3 text-slate-500 md:block">
          <Stamp className="size-5" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="relative overflow-hidden border-slate-200 bg-white/90 before:absolute before:right-4 before:top-4 before:size-14 before:rounded-full before:border before:border-dashed before:border-sky-200 before:content-['']"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-950">{item.name}</h2>
                    {item.primaryCategory ? (
                      <Badge className="bg-sky-100 text-sky-700">{item.primaryCategory}</Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-500">
                    {item.city} · {item.region}
                  </p>
                </div>
                <div className="rounded-full bg-rose-50 p-2 text-rose-500">
                  <Star className="size-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                {item.formattedAddress}
              </div>
              {item.note ? (
                <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-900">
                  {item.note}
                </div>
              ) : null}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <MapPinned className="size-4 text-sky-600" />
                저장 상태: {item.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
