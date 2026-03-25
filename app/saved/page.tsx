import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SavedPlacesPage } from "@/features/saved-places/SavedPlacesPage";
import type { SavedPlaceRecord } from "@/lib/types/domain";

function serializeSavedPlace(row: Record<string, unknown>): SavedPlaceRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    provider: "google_places",
    providerPlaceId: String(row.provider_place_id),
    name: String(row.name),
    formattedAddress: String(row.formatted_address),
    city: String(row.city),
    region: String(row.region),
    countryCode: String(row.country_code),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    googleMapsUri:
      typeof row.google_maps_uri === "string" ? row.google_maps_uri : null,
    photoUrl: typeof row.photo_url === "string" ? row.photo_url : null,
    primaryCategory:
      typeof row.primary_category === "string" ? row.primary_category : null,
    status: row.status as SavedPlaceRecord["status"],
    note: typeof row.note === "string" ? row.note : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export default async function SavedPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SavedPlacesPage authRequired items={[]} />;
  }

  const { data } = await supabase
    .from("saved_places")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <SavedPlacesPage
      authRequired={false}
      items={Array.isArray(data) ? data.map((row) => serializeSavedPlace(row)) : []}
    />
  );
}
