import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PlaceSearchBox() {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/90 p-3 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="sr-only" htmlFor="place-search">
          장소 검색
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="place-search"
            className="pl-10"
            placeholder="도쿄, 오사카, 교토 장소 검색"
          />
        </div>
        <Button className="h-11 px-5">장소 찾기</Button>
      </div>
    </div>
  );
}

