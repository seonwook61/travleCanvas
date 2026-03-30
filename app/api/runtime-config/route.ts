import { NextResponse } from "next/server";

import { getRuntimePublicConfig } from "@/lib/runtime/public-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(getRuntimePublicConfig(), {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
