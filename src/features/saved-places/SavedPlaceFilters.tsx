"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { savedPlaceStatusValues, type SavedPlaceStatus } from "@/lib/types/domain";

const statusLabelMap: Record<SavedPlaceStatus, string> = {
  wishlist: "가고 싶음",
  visited: "다녀옴",
  favorite: "즐겨찾기",
};

interface SavedPlaceFiltersProps {
  activeStatus: SavedPlaceStatus | "all";
  counts: Record<SavedPlaceStatus, number>;
  onStatusChange: (status: SavedPlaceStatus | "all") => void;
}

export function SavedPlaceFilters({
  activeStatus,
  counts,
  onStatusChange,
}: SavedPlaceFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant={activeStatus === "all" ? "primary" : "secondary"}
        className="rounded-full"
        onClick={() => onStatusChange("all")}
      >
        전체
        <Badge className="ml-2 bg-white/80 text-slate-700">{Object.values(counts).reduce((sum, count) => sum + count, 0)}</Badge>
      </Button>

      {savedPlaceStatusValues.map((status) => (
        <Button
          key={status}
          variant={activeStatus === status ? "primary" : "secondary"}
          className="rounded-full"
          onClick={() => onStatusChange(status)}
        >
          {statusLabelMap[status]}
          <Badge className="ml-2 bg-white/80 text-slate-700">{counts[status]}</Badge>
        </Button>
      ))}
    </div>
  );
}
