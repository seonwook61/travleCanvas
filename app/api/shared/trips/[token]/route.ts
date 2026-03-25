import { NextResponse } from "next/server";

import { getSharedTripDetail } from "@/lib/share/get-shared-trip-detail";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const detail = await getSharedTripDetail(token);

    if (!detail) {
      return NextResponse.json({ error: "공유 trip을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(detail, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "공유 trip을 불러오는 중 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}
