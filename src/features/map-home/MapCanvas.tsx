"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, MapPinned, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { isGoogleMapsBrowserConfigured, loadGoogleMapsLibraries } from "@/lib/google-maps/load-script";
import type { RuntimePublicConfig } from "@/lib/runtime/public-config";
import type { NormalizedPlaceResult } from "@/lib/types/domain";

const CITY_CENTERS: Record<string, google.maps.LatLngLiteral> = {
  도쿄: { lat: 35.6764, lng: 139.65 },
  오사카: { lat: 34.6937, lng: 135.5023 },
  교토: { lat: 35.0116, lng: 135.7681 },
};

const PENDING_SAVE_STORAGE_KEY = "trip-canvas.pending-save-place";

interface MapCanvasProps {
  error: string | null;
  isSearching: boolean;
  results: NormalizedPlaceResult[];
  searchSource: "fallback" | "google";
  selectedCity: string;
}

export function MapCanvas({
  error,
  isSearching,
  results,
  searchSource,
  selectedCity,
}: MapCanvasProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const pendingResumeHandledRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [runtimeConfig, setRuntimeConfig] = useState<RuntimePublicConfig | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingPlaceId, setSavingPlaceId] = useState<string | null>(null);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadRuntimeConfig() {
      try {
        const response = await fetch("/api/runtime-config", {
          cache: "no-store",
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to load runtime config");
        }

        const payload = (await response.json()) as RuntimePublicConfig;

        if (!cancelled) {
          setRuntimeConfig(payload);
        }
      } catch {
        if (!cancelled) {
          setRuntimeConfig({
            googleMapsClientKey: null,
            siteUrl: null,
            supabaseAnonKey: null,
            supabaseUrl: null,
          });
        }
      } finally {
        if (!cancelled) {
          setConfigLoaded(true);
        }
      }
    }

    void loadRuntimeConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const googleMapsClientKey = runtimeConfig?.googleMapsClientKey ?? null;
  const hasGoogleMapsKey = isGoogleMapsBrowserConfigured(googleMapsClientKey);
  const hasResults = results.length > 0;
  const resultsToRender = useMemo(() => results.slice(0, 4), [results]);
  const showFallbackState = configLoaded && (!hasGoogleMapsKey || Boolean(mapError));

  async function persistPlace(place: NormalizedPlaceResult) {
    setSavingPlaceId(place.providerPlaceId);
    setSaveError(null);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/saved-places", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          providerPlaceId: place.providerPlaceId,
          name: place.name,
          formattedAddress: place.formattedAddress,
          city: place.city,
          region: place.region,
          countryCode: place.countryCode,
          latitude: place.latitude,
          longitude: place.longitude,
          status: "wishlist",
          googleMapsUri: place.googleMapsUri ?? null,
          photoUrl: place.photoUrl ?? null,
          primaryCategory: place.primaryCategory ?? null,
          note: null,
        }),
      });

      if (response.status === 401) {
        return {
          outcome: "auth_required" as const,
        };
      }

      if (response.status === 409) {
        setSavedPlaceIds((current) =>
          current.includes(place.providerPlaceId)
            ? current
            : [...current, place.providerPlaceId],
        );
        setSaveMessage(`${place.name}은(는) 이미 저장한 장소입니다. /saved에서 바로 확인해 보세요.`);
        return {
          outcome: "already_saved" as const,
        };
      }

      if (!response.ok) {
        throw new Error("장소 저장 요청에 실패했습니다.");
      }

      setSavedPlaceIds((current) =>
        current.includes(place.providerPlaceId)
          ? current
          : [...current, place.providerPlaceId],
      );
      setSaveMessage(`${place.name}을(를) 가고 싶음 목록에 저장했습니다.`);
      return {
        outcome: "saved" as const,
      };
    } catch {
      setSaveError("장소 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return {
        outcome: "failed" as const,
      };
    } finally {
      setSavingPlaceId(null);
    }
  }

  async function handleSavePlace(place: NormalizedPlaceResult) {
    const result = await persistPlace(place);

    if (result?.outcome === "auth_required") {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(PENDING_SAVE_STORAGE_KEY, JSON.stringify(place));
      }

      router.push(`/auth/sign-in?next=${encodeURIComponent("/?resumeSave=1")}`);
    }
  }

  useEffect(() => {
    if (!configLoaded || searchParams.get("resumeSave") !== "1" || pendingResumeHandledRef.current) {
      return;
    }

    pendingResumeHandledRef.current = true;

    const rawPendingPlace =
      typeof window === "undefined"
        ? null
        : window.sessionStorage.getItem(PENDING_SAVE_STORAGE_KEY);

    if (!rawPendingPlace) {
      router.replace("/");
      return;
    }

    async function resumePendingSave() {
      try {
        const pendingPlace = JSON.parse(rawPendingPlace) as NormalizedPlaceResult;
        const result = await persistPlace(pendingPlace);

        if (result?.outcome === "auth_required") {
          setSaveError("로그인 이후 저장 흐름을 이어가지 못했습니다. 다시 시도해 주세요.");
        }
      } catch {
        setSaveError("로그인 이후 저장 흐름을 복구하지 못했습니다. 다시 시도해 주세요.");
      } finally {
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(PENDING_SAVE_STORAGE_KEY);
        }

        router.replace("/");
      }
    }

    void resumePendingSave();
  }, [configLoaded, router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function renderMap() {
      if (!mapRef.current || !configLoaded || !hasGoogleMapsKey) {
        setMapReady(false);
        return;
      }

      try {
        const libraries = await loadGoogleMapsLibraries(googleMapsClientKey);

        if (!libraries || !mapRef.current || cancelled) {
          return;
        }

        const fallbackCenter = CITY_CENTERS[selectedCity] ?? CITY_CENTERS.도쿄;
        const firstPlace = results[0];
        const center = firstPlace
          ? { lat: firstPlace.latitude, lng: firstPlace.longitude }
          : fallbackCenter;

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new libraries.Map(mapRef.current, {
            center,
            zoom: firstPlace ? 12 : 10,
            disableDefaultUI: true,
            clickableIcons: false,
          });
        }

        const map = mapInstanceRef.current;
        map.setCenter(center);
        map.setZoom(firstPlace ? 12 : 10);

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        if (results.length > 0) {
          const bounds = new google.maps.LatLngBounds();

          results.slice(0, 8).forEach((place) => {
            const marker = new google.maps.Marker({
              map,
              position: { lat: place.latitude, lng: place.longitude },
              title: place.name,
            });

            markersRef.current.push(marker);
            bounds.extend(marker.getPosition() as google.maps.LatLng);
          });

          if (results.length > 1) {
            map.fitBounds(bounds, 72);
          }
        }

        setMapError(null);
        setMapReady(true);
      } catch {
        if (!cancelled) {
          setMapReady(false);
          setMapError("Google Maps 로드에 실패해 fallback 화면으로 표시합니다.");
        }
      }
    }

    void renderMap();

    return () => {
      cancelled = true;
    };
  }, [configLoaded, googleMapsClientKey, hasGoogleMapsKey, results, selectedCity]);

  return (
    <Card className="h-full min-h-[420px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.35),_transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sky-700">지도 캔버스</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            일본 전역에서 저장할 장소를 찾으세요
          </h2>
        </div>
        <div className="rounded-full bg-white/80 p-3 text-sky-600 shadow-sm">
          <MapPinned className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-[360px] overflow-hidden rounded-[28px] border border-white/70 bg-white/80">
          {!configLoaded ? (
            <div className="flex h-full min-h-[360px] flex-col justify-between bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
                <Compass className="size-4" />
                {selectedCity} 지도 설정 불러오는 중
              </div>
              <div className="rounded-[24px] border border-dashed border-sky-200 bg-white/85 p-5 text-sm leading-7 text-slate-600">
                공개 런타임 설정을 불러오는 중입니다. 잠시 후 실제 지도 또는 fallback
                상태가 자동으로 표시됩니다.
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {Object.keys(CITY_CENTERS).map((city) => (
                  <div
                    key={city}
                    className="rounded-2xl bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          ) : !showFallbackState ? (
            <div ref={mapRef} className="h-full min-h-[360px] w-full" />
          ) : (
            <div className="flex h-full min-h-[360px] flex-col justify-between bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
                <Compass className="size-4" />
                {selectedCity} 중심 fallback 지도
              </div>
              <div className="rounded-[24px] border border-dashed border-sky-200 bg-white/85 p-5 text-sm leading-7 text-slate-600">
                {mapError
                  ? `${mapError} 브라우저 키 제한과 현재 접속 호스트를 함께 확인해 주세요.`
                  : "브라우저용 Google Maps 키를 런타임 설정으로 불러오지 못해 fallback 상태로 표시합니다. 지금은 검색 결과와 quick city 흐름을 확인할 수 있도록 안전한 fallback 상태를 제공합니다."}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {Object.keys(CITY_CENTERS).map((city) => (
                  <div
                    key={city}
                    className="rounded-2xl bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex min-h-[360px] flex-col gap-3 rounded-[28px] border border-white/70 bg-white/75 p-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">저장 후보</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">
                {selectedCity} 중심 추천 결과
              </h3>
            </div>
            <Badge className={searchSource === "google" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
              {searchSource === "google" ? "Google Places" : "Fallback"}
            </Badge>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600">
            {isSearching
              ? "장소를 찾는 중입니다..."
              : hasResults
                ? `저장 전에 장소 후보를 훑고, 로그인 후 내 라이브러리에 담을 수 있습니다.`
                : "검색어 또는 주요 도시 버튼으로 일본 장소를 찾아보세요."}
          </div>

          {error || mapError || saveError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {saveError ?? error ?? mapError}
            </div>
          ) : null}

          {saveMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {saveMessage}
            </div>
          ) : null}

          <div className="flex-1 space-y-3">
            {resultsToRender.map((place) => (
              <div
                key={place.providerPlaceId}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{place.name}</p>
                      {place.primaryCategory ? (
                        <Badge className="bg-sky-100 text-sky-700">{place.primaryCategory}</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-500">
                      {place.city} · {place.region}
                    </p>
                  </div>
                  <Sparkles className="size-4 text-amber-500" />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{place.formattedAddress}</p>
                <Button
                  variant="secondary"
                  className="mt-4 w-full rounded-2xl"
                  disabled={savingPlaceId === place.providerPlaceId || savedPlaceIds.includes(place.providerPlaceId)}
                  onClick={() => {
                    void handleSavePlace(place);
                  }}
                >
                  {savedPlaceIds.includes(place.providerPlaceId)
                    ? "저장됨"
                    : savingPlaceId === place.providerPlaceId
                      ? "저장 중..."
                      : "로그인 후 저장"}
                </Button>
              </div>
            ))}

            {!hasResults ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm leading-6 text-slate-500">
                아직 표시할 검색 결과가 없습니다. 도쿄, 오사카, 교토 quick entry 또는 검색어로
                탐색을 시작해 보세요.
              </div>
            ) : null}
          </div>

          <div className="text-xs leading-6 text-slate-500">
            {mapReady
              ? "실제 지도 위에 결과를 렌더링 중입니다."
              : configLoaded
                ? "지도 키가 없거나 fallback 모드여도 탐색 흐름은 그대로 확인할 수 있습니다."
                : "공개 런타임 설정을 먼저 불러오는 중입니다."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
