import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let optionsConfigured = false;
let configuredKey: string | null = null;

export function isGoogleMapsBrowserConfigured(apiKey: string | null | undefined) {
  return Boolean(apiKey);
}

export async function loadGoogleMapsLibraries(apiKey: string | null | undefined) {
  if (!apiKey) {
    return null;
  }

  if (!optionsConfigured || configuredKey !== apiKey) {
    setOptions({
      key: apiKey,
      language: "ko",
      region: "JP",
      v: "weekly",
    });
    optionsConfigured = true;
    configuredKey = apiKey;
  }

  const mapsLibrary = await importLibrary("maps");

  return {
    Map: mapsLibrary.Map,
  };
}
