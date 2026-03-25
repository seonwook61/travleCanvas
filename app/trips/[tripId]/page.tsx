import { TripDetailPage } from "@/features/trips/TripDetailPage";
import { getTripDetail } from "@/lib/trips/get-trip-detail";

export default async function TripDetailRoute({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const detail = await getTripDetail(tripId);

  return (
    <TripDetailPage
      authRequired={detail.authRequired}
      trip={detail.trip}
      tripDays={detail.tripDays}
      savedPlaces={detail.savedPlaces}
    />
  );
}
