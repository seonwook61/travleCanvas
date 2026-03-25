import { createClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv, getSupabaseServerEnv } from "@/lib/env";

export function createSupabaseAdminClient() {
  const { url } = getSupabasePublicEnv();
  const { serviceRoleKey } = getSupabaseServerEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
