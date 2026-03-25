export const savedPlaceStatusValues = ["wishlist", "visited", "favorite"] as const;
export const tripVisibilityValues = ["private"] as const;
export const shareLinkPermissionValues = ["read_only"] as const;

export type SavedPlaceStatus = (typeof savedPlaceStatusValues)[number];
export type TripVisibility = (typeof tripVisibilityValues)[number];
export type ShareLinkPermission = (typeof shareLinkPermissionValues)[number];

export type AuthProvider = "google";

export interface NormalizedPlaceResult {
  provider: "google_places";
  providerPlaceId: string;
  name: string;
  formattedAddress: string;
  city: string;
  region: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  googleMapsUri?: string | null;
  photoUrl?: string | null;
  primaryCategory?: string | null;
}

export interface SavedPlaceRecord extends NormalizedPlaceResult {
  id: string;
  userId: string;
  status: SavedPlaceStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripRecord {
  id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  visibility: TripVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItemRecord {
  id: string;
  tripDayId: string;
  savedPlaceId: string;
  sortOrder: number;
  note: string | null;
  createdAt?: string;
  updatedAt?: string;
  savedPlace?: SavedPlaceRecord;
}

export interface TripDayRecord {
  id: string;
  tripId: string;
  dayNumber: number;
  tripDate: string;
  createdAt?: string;
  items: ItineraryItemRecord[];
}
