import { Heart, MapPinned, Route, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SavedPlaceRecord } from "@/lib/types/domain";

const statusCopy: Record<SavedPlaceRecord["status"], { label: string; tone: string }> = {
  wishlist: { label: "가고 싶음", tone: "bg-sky-100 text-sky-700" },
  visited: { label: "다녀옴", tone: "bg-emerald-100 text-emerald-700" },
  favorite: { label: "즐겨찾기", tone: "bg-rose-100 text-rose-700" },
};

interface SavedPlaceCardProps {
  item: SavedPlaceRecord;
}

export function SavedPlaceCard({ item }: SavedPlaceCardProps) {
  const status = statusCopy[item.status];

  return (
    <Card className="border-slate-200 bg-white/90">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
            <Badge className={status.tone}>{status.label}</Badge>
            {item.primaryCategory ? (
              <Badge className="bg-amber-100 text-amber-700">{item.primaryCategory}</Badge>
            ) : null}
          </div>
          <p className="text-sm text-slate-500">
            {item.city} · {item.region}
          </p>
        </div>
        <div className="rounded-full bg-slate-100 p-2 text-slate-500">
          {item.status === "favorite" ? (
            <Heart className="size-4 text-rose-500" />
          ) : (
            <Sparkles className="size-4" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          {item.formattedAddress}
        </div>

        {item.note ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
            {item.note}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button className="rounded-2xl">
            <Route className="mr-2 size-4" />
            trip에 담기
          </Button>
          <Button variant="secondary" className="rounded-2xl">
            <MapPinned className="mr-2 size-4" />
            지도에서 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
