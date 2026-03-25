import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export class AuthRequiredError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "AuthRequiredError";
  }
}

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthRequiredError();
  }

  return { supabase, user };
}

export function unauthorizedJson(message = "로그인이 필요합니다.") {
  return NextResponse.json({ error: message }, { status: 401 });
}
