export interface RuntimePublicConfig {
  googleMapsClientKey: string | null;
  siteUrl: string | null;
  supabaseAnonKey: string | null;
  supabaseUrl: string | null;
}

function readOptionalEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    return null;
  }

  return value;
}

export function getRuntimePublicConfig(): RuntimePublicConfig {
  return {
    googleMapsClientKey: readOptionalEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),
    siteUrl: readOptionalEnv("NEXT_PUBLIC_SITE_URL"),
    supabaseAnonKey: readOptionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseUrl: readOptionalEnv("NEXT_PUBLIC_SUPABASE_URL"),
  };
}
