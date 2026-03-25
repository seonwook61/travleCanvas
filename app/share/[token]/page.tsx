import { notFound } from "next/navigation";

import { SharedTripPage } from "@/features/share/SharedTripPage";
import { getSharedTripDetail } from "@/lib/share/get-shared-trip-detail";

export default async function SharedTripRoute({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const detail = await getSharedTripDetail(token);

  if (!detail) {
    notFound();
  }

  return <SharedTripPage detail={detail} />;
}
