import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let optionsConfigured = false;

export function isGoogleMapsBrowserConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}

export async function loadGoogleMapsLibraries() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!optionsConfigured) {
    setOptions({
      key: apiKey,
      language: "ko",
      region: "JP",
      v: "weekly",
    });
    optionsConfigured = true;
  }

  const mapsLibrary = await importLibrary("maps");

  return {
    Map: mapsLibrary.Map,
  };
}
