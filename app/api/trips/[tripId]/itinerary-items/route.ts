import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthRequiredError, requireUser, unauthorizedJson } from "@/lib/auth/require-user";
import { serializeItineraryItem } from "@/lib/trips/trip-utils";
import { itineraryItemCreateSchema } from "@/lib/validation/trip";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const [{ tripId }, { supabase, user }, rawPayload] = await Promise.all([
      params,
      requireUser(),
      request.json(),
    ]);
    const payload = itineraryItemCreateSchema.parse(rawPayload);

    const { data: tripDay, error: tripDayError } = await supabase
      .from("trip_days")
      .select("id, trip_id")
      .eq("id", payload.tripDayId)
      .eq("trip_id", tripId)
      .single();

    if (tripDayError || !tripDay) {
      return NextResponse.json(
        { error: "선택한 trip day를 찾지 못했습니다." },
        { status: 404 },
      );
    }

    const { data: savedPlace, error: savedPlaceError } = await supabase
      .from("saved_places")
      .select("id")
      .eq("id", payload.savedPlaceId)
      .eq("user_id", user.id)
      .single();

    if (savedPlaceError || !savedPlace) {
      return NextResponse.json(
        { error: "선택한 saved place를 찾지 못했습니다." },
        { status: 404 },
      );
    }

    const { data: latestItem } = await supabase
      .from("itinerary_items")
      .select("sort_order")
      .eq("trip_day_id", payload.tripDayId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data, error } = await supabase
      .from("itinerary_items")
      .insert({
        trip_day_id: payload.tripDayId,
        saved_place_id: payload.savedPlaceId,
        sort_order: typeof latestItem?.sort_order === "number" ? latestItem.sort_order + 1 : 0,
        note: payload.note ?? null,
      })
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "itinerary item 추가에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({ item: serializeItineraryItem(data) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return unauthorizedJson();
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "유효하지 않은 itinerary item 요청입니다.", issues: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "itinerary item 추가 중 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}
