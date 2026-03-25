import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "@/lib/env";

let browserClient: SupabaseClient | undefined;

export function createSupabaseBrowserClient() {
  if (!browserClient) {
    const { anonKey, url } = getSupabasePublicEnv();

    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}
