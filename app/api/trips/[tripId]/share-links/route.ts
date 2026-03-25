import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthRequiredError, requireUser, unauthorizedJson } from "@/lib/auth/require-user";
import type { ShareLinkRecord } from "@/lib/types/domain";
import { shareLinkCreateSchema } from "@/lib/validation/share-link";

function serializeShareLink(row: Record<string, unknown>): ShareLinkRecord {
  return {
    id: String(row.id),
    tripId: String(row.trip_id),
    token: String(row.token),
    permission: row.permission as ShareLinkRecord["permission"],
    createdBy: String(row.created_by),
    createdAt: String(row.created_at),
    expiresAt: typeof row.expires_at === "string" ? row.expires_at : null,
  };
}

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
    const payload = shareLinkCreateSchema.parse(rawPayload);

    if (payload.tripId !== tripId) {
      return NextResponse.json(
        { error: "공유 링크 대상 trip이 일치하지 않습니다." },
        { status: 400 },
      );
    }

    const token = `share_${randomUUID().replaceAll("-", "")}`;
    const { data, error } = await supabase
      .from("share_links")
      .insert({
        trip_id: tripId,
        token,
        permission: payload.permission,
        created_by: user.id,
      })
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "읽기 전용 공유 링크 생성에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({ shareLink: serializeShareLink(data) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return unauthorizedJson();
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "유효하지 않은 공유 링크 생성 요청입니다.", issues: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "공유 링크 생성 중 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}
