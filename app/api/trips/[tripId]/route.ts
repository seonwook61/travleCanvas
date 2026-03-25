import { NextResponse } from "next/server";

import { AuthRequiredError, requireUser, unauthorizedJson } from "@/lib/auth/require-user";
import { getTripDetail } from "@/lib/trips/get-trip-detail";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    await requireUser();
    const { tripId } = await params;
    const detail = await getTripDetail(tripId);

    if (!detail.trip) {
      return NextResponse.json({ error: "trip을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return unauthorizedJson();
    }

    return NextResponse.json(
      { error: "trip 상세 조회 중 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}
