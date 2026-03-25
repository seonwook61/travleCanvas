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
    const { supabase } = await requireUser();
    const payload = itineraryItemCreateSchema.parse(await request.json());
    await params;
    const { data, error } = await supabase
      .from("itinerary_items")
      .insert({
        trip_day_id: payload.tripDayId,
        saved_place_id: payload.savedPlaceId,
        sort_order: 0,
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
