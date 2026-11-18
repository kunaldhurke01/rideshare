import { GeoPoint, LocationItem, MatchCandidate, MatchingWeights, Passenger } from '../types';
import { getDrivingDistanceKm, getDrivingDurationMinutes, getHaversineDistanceKm } from './mapService';
import { calculateDynamicFares } from './fareEngine';

// Default configurable weights for the Route Compatibility Engine
export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  routeOverlap: 0.40,     // 40% weight on shared corridor
  detour: 0.25,           // 25% weight on minimizing additional travel time/distance
  proximity: 0.15,        // 15% weight on pickup/drop closeness to corridor
  direction: 0.10,        // 10% weight on vector heading alignment
  time: 0.10              // 10% weight on temporal departure synchronization
};

export interface RouteCompatibilityResult {
  matchScore: number;
  isCompatible: boolean;
  sharedDistanceKm: number;
  detourDistanceKm: number;
  detourMinutes: number;
  overlapPercentage: number;
  directionCosine: number;
  breakdown: {
    overlapScore: number;
    detourScore: number;
    proximityScore: number;
    directionScore: number;
    timeScore: number;
  };
}

/**
 * Calculates direction alignment between two route vectors using vector dot product
 */
function calculateDirectionCosine(
  p1Start: GeoPoint,
  p1End: GeoPoint,
  p2Start: GeoPoint,
  p2End: GeoPoint
): number {
  const v1x = p1End.lng - p1Start.lng;
  const v1y = p1End.lat - p1Start.lat;
  const v2x = p2End.lng - p2Start.lng;
  const v2y = p2End.lat - p2Start.lat;

  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

  if (mag1 === 0 || mag2 === 0) return 0;
  const dot = v1x * v2x + v1y * v2y;
  const cos = dot / (mag1 * mag2);
  // Normalize from [-1, 1] to [0, 1]
  return Math.max(0, Math.min(1, (cos + 1) / 2));
}

/**
 * Analyzes route compatibility between an active ride route and a requesting passenger
 */
export function analyzeRouteCompatibility(
  primaryPickup: LocationItem,
  primaryDest: LocationItem,
  candidatePickup: LocationItem,
  candidateDest: LocationItem,
  weights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS
): RouteCompatibilityResult {
  // 1. Direct distances
  const primaryDirectKm = getDrivingDistanceKm(primaryPickup.coordinates, primaryDest.coordinates);
  const candidateDirectKm = getDrivingDistanceKm(candidatePickup.coordinates, candidateDest.coordinates);

  // 2. Route combining sequence: Primary Pickup -> Candidate Pickup -> Candidate Dropoff -> Primary Dropoff
  // Or Candidate Pickup -> Primary Dropoff -> Candidate Dropoff depending on order
  const distP1toP2 = getDrivingDistanceKm(primaryPickup.coordinates, candidatePickup.coordinates);
  const distP2toD2 = getDrivingDistanceKm(candidatePickup.coordinates, candidateDest.coordinates);
  const distD2toD1 = getDrivingDistanceKm(candidateDest.coordinates, primaryDest.coordinates);
  
  const combinedDistanceKm = distP1toP2 + distP2toD2 + distD2toD1;
  const detourDistanceKm = Math.max(0.4, Number((combinedDistanceKm - primaryDirectKm).toFixed(1)));
  const detourMinutes = Math.max(2, getDrivingDurationMinutes(detourDistanceKm));

  // 3. Shared route estimation (corridor overlap)
  // Distance from candidate pickup to either candidate dest or primary dest
  const sharedDistanceKm = Math.max(1.0, Math.min(primaryDirectKm, candidateDirectKm, Number((primaryDirectKm - distP1toP2 * 0.4).toFixed(1))));
  const overlapPercentage = Math.min(98, Math.round((sharedDistanceKm / primaryDirectKm) * 100));

  // 4. Direction compatibility
  const directionCosine = calculateDirectionCosine(
    primaryPickup.coordinates,
    primaryDest.coordinates,
    candidatePickup.coordinates,
    candidateDest.coordinates
  );

  // 5. Proximity to corridor (distance from candidate pickup to primary axis)
  const pickupCorridorDist = distP1toP2;
  const dropCorridorDist = distD2toD1;
  const avgCorridorOffset = (pickupCorridorDist + dropCorridorDist) / 2;

  // Normalization scores [0-100]
  const overlapScore = Math.min(100, Math.max(20, overlapPercentage));
  const detourScore = Math.max(0, Math.min(100, Math.round(100 - (detourMinutes / 15) * 80)));
  const proximityScore = Math.max(0, Math.min(100, Math.round(100 - (avgCorridorOffset / 10) * 60)));
  const directionScore = Math.round(directionCosine * 100);
  const timeScore = 95; // Instant request right now

  // Weighted composite score calculation
  const compositeScore = Math.round(
    overlapScore * weights.routeOverlap +
    detourScore * weights.detour +
    proximityScore * weights.proximity +
    directionScore * weights.direction +
    timeScore * weights.time
  );

  const finalMatchScore = Math.min(99, Math.max(45, compositeScore));
  const isCompatible = finalMatchScore >= 70 && detourMinutes <= 12;

  return {
    matchScore: finalMatchScore,
    isCompatible,
    sharedDistanceKm,
    detourDistanceKm,
    detourMinutes,
    overlapPercentage,
    directionCosine,
    breakdown: {
      overlapScore,
      detourScore,
      proximityScore,
      directionScore,
      timeScore
    }
  };
}

/**
 * Creates match candidate object complete with live dynamic fare savings
 */
export function createMatchCandidate(
  id: string,
  passengerName: string,
  passengerAvatar: string,
  passengerRating: number,
  pickup: LocationItem,
  destination: LocationItem,
  primaryPassenger: Passenger,
  seatsRequested = 1,
  weights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS
): MatchCandidate {
  const analysis = analyzeRouteCompatibility(
    primaryPassenger.pickup,
    primaryPassenger.destination,
    pickup,
    destination,
    weights
  );

  // Calculate dynamic fare changes
  const fares = calculateDynamicFares({
    primaryDistanceKm: getDrivingDistanceKm(primaryPassenger.pickup.coordinates, primaryPassenger.destination.coordinates),
    candidateDistanceKm: getDrivingDistanceKm(pickup.coordinates, destination.coordinates),
    sharedDistanceKm: analysis.sharedDistanceKm,
    detourDistanceKm: analysis.detourDistanceKm,
    existingPassengersCount: 1,
    newPassengersCount: seatsRequested
  });

  return {
    id,
    passengerName,
    passengerAvatar,
    passengerRating,
    pickup,
    destination,
    matchScore: analysis.matchScore,
    sharedDistanceKm: analysis.sharedDistanceKm,
    detourDistanceKm: analysis.detourDistanceKm,
    detourMinutes: analysis.detourMinutes,
    overlapPercentage: analysis.overlapPercentage,
    estimatedSavings: fares.primaryPassengerSavings,
    originalFare: fares.primarySoloFare,
    newFare: fares.primarySharedFare,
    seatsRequested,
    reasonText: `${analysis.overlapPercentage}% corridor overlap with +${analysis.detourMinutes} min detour`
  };
}
