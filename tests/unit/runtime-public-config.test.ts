import { afterEach, describe, expect, it } from "vitest";

import { getRuntimePublicConfig } from "@/lib/runtime/public-config";

const originalEnv = {
  googleMapsClientKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
};

afterEach(() => {
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = originalEnv.googleMapsClientKey;
  process.env.NEXT_PUBLIC_SITE_URL = originalEnv.siteUrl;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalEnv.supabaseAnonKey;
  process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv.supabaseUrl;
});

describe("getRuntimePublicConfig", () => {
  it("returns the public runtime config from the current process env", () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "browser-key";
    process.env.NEXT_PUBLIC_SITE_URL = "https://trip-canvas.example.com";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";

    expect(getRuntimePublicConfig()).toEqual({
      googleMapsClientKey: "browser-key",
      siteUrl: "https://trip-canvas.example.com",
      supabaseAnonKey: "anon-key",
      supabaseUrl: "https://example.supabase.co",
    });
  });

  it("normalizes missing public env values to null", () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    expect(getRuntimePublicConfig()).toEqual({
      googleMapsClientKey: null,
      siteUrl: null,
      supabaseAnonKey: null,
      supabaseUrl: null,
    });
  });
});
