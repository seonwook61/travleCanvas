import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthRequiredError, requireUser, unauthorizedJson } from "@/lib/auth/require-user";
import { savedPlaceStatusValues } from "@/lib/types/domain";
import { savedPlaceSchema } from "@/lib/validation/saved-place";

function serializeSavedPlace(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    provider: String(row.provider ?? "google_places"),
    providerPlaceId: String(row.provider_place_id),
    name: String(row.name),
    formattedAddress: String(row.formatted_address),
    city: String(row.city),
    region: String(row.region),
    countryCode: String(row.country_code),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    googleMapsUri:
      typeof row.google_maps_uri === "string" ? row.google_maps_uri : null,
    photoUrl: typeof row.photo_url === "string" ? row.photo_url : null,
    primaryCategory:
      typeof row.primary_category === "string" ? row.primary_category : null,
    status: String(row.status),
    note: typeof row.note === "string" ? row.note : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const status = new URL(request.url).searchParams.get("status");
    const query = supabase
      .from("saved_places")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (status) {
      if (!savedPlaceStatusValues.includes(status as (typeof savedPlaceStatusValues)[number])) {
        return NextResponse.json(
          { error: "지원하지 않는 saved place status 필터입니다." },
          { status: 400 },
        );
      }

      query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "저장한 장소를 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      items: Array.isArray(data) ? data.map((row) => serializeSavedPlace(row)) : [],
    });
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return unauthorizedJson();
    }

    return NextResponse.json(
      { error: "저장한 장소 조회 중 알 수 없는 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const payload = savedPlaceSchema.parse(await request.json());
    const insertPayload = {
      user_id: user.id,
      provider: "google_places",
      provider_place_id: payload.providerPlaceId,
      name: payload.name,
      formatted_address: payload.formattedAddress,
      city: payload.city,
      region: payload.region,
      country_code: payload.countryCode,
      latitude: payload.latitude,
      longitude: payload.longitude,
      google_maps_uri: payload.googleMapsUri ?? null,
      photo_url: payload.photoUrl ?? null,
      primary_category: payload.primaryCategory ?? null,
      status: payload.status,
      note: payload.note ?? null,
    };
    const { data, error } = await supabase
      .from("saved_places")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "장소 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { item: serializeSavedPlace(data) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return unauthorizedJson();
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "유효하지 않은 저장 요청입니다.",
          issues: error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "장소 저장 중 알 수 없는 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}
