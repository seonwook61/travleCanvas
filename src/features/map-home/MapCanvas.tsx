import { MapPinned } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MapCanvas() {
  return (
    <Card className="h-full min-h-[420px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.35),_transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sky-700">지도 캔버스</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            일본 전역에서 저장할 장소를 찾으세요
          </h2>
        </div>
        <div className="rounded-full bg-white/80 p-3 text-sky-600 shadow-sm">
          <MapPinned className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="h-[320px]">
        <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/70 bg-white/70 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sm text-slate-700">
              도쿄
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-slate-700">
              오사카
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-sm text-slate-700">
              교토
            </div>
          </div>
          <div className="rounded-[28px] border border-dashed border-sky-200 bg-white/80 p-6 text-sm leading-7 text-slate-600">
            Google Maps API 키를 연결하면 여기에 실제 지도가 표시됩니다. 지금 단계에서는
            저장 중심 홈 구조와 탐색 레이아웃을 먼저 확인할 수 있게 앱 셸을 제공합니다.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

