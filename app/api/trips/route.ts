import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthRequiredError, requireUser, unauthorizedJson } from "@/lib/auth/require-user";
import { buildTripDayRows, serializeTrip, serializeTripDay } from "@/lib/trips/trip-utils";
import { tripCreateSchema } from "@/lib/validation/trip";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const payload = tripCreateSchema.parse(await request.json());
    const { data: tripRow, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        title: payload.title,
        start_date: payload.startDate,
        end_date: payload.endDate,
        visibility: "private",
      })
      .select("*")
      .single();

    if (tripError || !tripRow) {
      return NextResponse.json(
        { error: "trip 생성에 실패했습니다." },
        { status: 500 },
      );
    }

    const tripDayRows = buildTripDayRows(tripRow.id, payload.startDate, payload.endDate);
    const { data: createdTripDays, error: tripDaysError } = await supabase
      .from("trip_days")
      .insert(tripDayRows)
      .select("*");

    if (tripDaysError) {
      return NextResponse.json(
        { error: "trip 날짜 구간 생성에 실패했습니다." },
        { status: 500 },
      );
    }

    if (payload.selectedPlaceIds.length > 0 && Array.isArray(createdTripDays) && createdTripDays[0]?.id) {
      await supabase.from("itinerary_items").insert(
        payload.selectedPlaceIds.map((savedPlaceId, index) => ({
          trip_day_id: createdTripDays[0].id,
          saved_place_id: savedPlaceId,
          sort_order: index,
          note: null,
        })),
      );
    }

    return NextResponse.json(
      {
        trip: serializeTrip(tripRow),
        tripDays: Array.isArray(createdTripDays)
          ? createdTripDays.map((row) => serializeTripDay(row))
          : [],
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return unauthorizedJson();
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "유효하지 않은 trip 생성 요청입니다.", issues: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "trip 생성 중 알 수 없는 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}
