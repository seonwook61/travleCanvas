const REQUIRED_ENV_KEYS = {
  supabaseUrl: "NEXT_PUBLIC_SUPABASE_URL",
  supabaseAnonKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  supabaseServiceRoleKey: "SUPABASE_SERVICE_ROLE_KEY",
  googleMapsClientKey: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  googleMapsServerKey: "GOOGLE_MAPS_SERVER_API_KEY",
} as const;

function readEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabasePublicEnv() {
  return {
    url: readEnv(REQUIRED_ENV_KEYS.supabaseUrl),
    anonKey: readEnv(REQUIRED_ENV_KEYS.supabaseAnonKey),
  };
}

export function getSupabaseServerEnv() {
  return {
    serviceRoleKey: readEnv(REQUIRED_ENV_KEYS.supabaseServiceRoleKey),
  };
}

export function getGoogleMapsClientEnv() {
  return {
    apiKey: readEnv(REQUIRED_ENV_KEYS.googleMapsClientKey),
  };
}

export function getGoogleMapsServerEnv() {
  return {
    apiKey: readEnv(REQUIRED_ENV_KEYS.googleMapsServerKey),
  };
}

export const envKeys = REQUIRED_ENV_KEYS;
