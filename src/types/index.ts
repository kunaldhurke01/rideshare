export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  area: string;
  coordinates: GeoPoint;
}

export interface StopPoint {
  id: string;
  passengerId: string;
  passengerName: string;
  type: 'pickup' | 'dropoff';
  location: LocationItem;
  status: 'pending' | 'approaching' | 'completed';
  etaMinutes: number;
}

export interface Passenger {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  phone: string;
  pickup: LocationItem;
  destination: LocationItem;
  originalFare: number;
  discountedFare: number;
  savings: number;
  joinedAt?: string;
  seats: number;
}

export interface MatchCandidate {
  id: string;
  passengerName: string;
  passengerAvatar: string;
  passengerRating: number;
  pickup: LocationItem;
  destination: LocationItem;
  matchScore: number; // percentage (e.g. 94)
  sharedDistanceKm: number;
  detourDistanceKm: number;
  detourMinutes: number;
  overlapPercentage: number;
  estimatedSavings: number;
  originalFare: number;
  newFare: number;
  seatsRequested: number;
  reasonText: string;
}

export interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  totalTrips: number;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleColor: string;
  vehicleCapacity: number; // default 4
  phone: string;
  currentLocation: GeoPoint;
  heading: number;
}

export interface FareBreakdown {
  originalSoloFare: number;
  totalBaseFare: number;
  distanceRate: number;
  totalDistanceKm: number;
  sharedDistanceKm: number;
  sharingDiscount: number;
  detourAdjustment: number;
  platformFee: number;
  driverEarnings: number;
  finalPassengerFare: number;
  passengerSavings: number;
}

export type RideStatus =
  | 'idle'
  | 'booking'
  | 'searching_driver'
  | 'driver_found'
  | 'searching_passengers'
  | 'match_found'
  | 'ride_active'
  | 'fare_summary'
  | 'payment_pending'
  | 'completed'
  | 'cancelled';

export interface ActiveRide {
  id: string;
  createdAt: string;
  status: RideStatus;
  primaryPassenger: Passenger;
  additionalPassengers: Passenger[];
  driver: Driver;
  sharingEnabled: boolean;
  vehicleCapacity: number;
  currentPassengersCount: number;
  availableSeats: number;
  stops: StopPoint[];
  currentStopIndex: number;
  fareBreakdown: FareBreakdown;
  routeCoordinates: GeoPoint[];
  vehicleProgress: number; // 0 to 1
  currentLocation: GeoPoint;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  pendingMatch?: MatchCandidate;
}

export interface HistoryRide {
  id: string;
  date: string;
  pickupName: string;
  destinationName: string;
  distanceKm: number;
  durationMinutes: number;
  driverName: string;
  vehicleInfo: string;
  shared: boolean;
  coPassengersCount: number;
  farePaid: number;
  savings: number;
  status: 'completed' | 'cancelled';
  ratingGiven: number;
}

export interface MatchingWeights {
  routeOverlap: number; // default 0.40
  detour: number; // default 0.25
  proximity: number; // default 0.15
  direction: number; // default 0.10
  time: number; // default 0.10
}
