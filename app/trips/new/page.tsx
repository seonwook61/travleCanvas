import { TripCreatePage } from "@/features/trips/TripCreatePage";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serializeSavedPlace } from "@/lib/trips/trip-utils";

export default async function TripCreateRoute() {
  if (!hasSupabasePublicEnv()) {
    return <TripCreatePage authRequired savedPlaces={[]} />;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <TripCreatePage authRequired savedPlaces={[]} />;
  }

  const { data } = await supabase
    .from("saved_places")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <TripCreatePage
      authRequired={false}
      savedPlaces={Array.isArray(data) ? data.map((row) => serializeSavedPlace(row)) : []}
    />
  );
}
