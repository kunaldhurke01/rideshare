import { GeoPoint, LocationItem, StopPoint } from '../types';

// Pre-defined realistic locations in the Pune metropolitan / tech hub corridor
export const LOCATIONS: LocationItem[] = [
  {
    id: 'loc-hinjawadi',
    name: 'Hinjawadi Phase 1',
    address: 'Rajiv Gandhi Infotech Park, Hinjawadi',
    area: 'West Pune Tech Zone',
    coordinates: { lat: 18.5913, lng: 73.7389 }
  },
  {
    id: 'loc-wakad',
    name: 'Wakad Junction',
    address: 'Dange Chowk Road, Wakad',
    area: 'Pimpri-Chinchwad Bypass',
    coordinates: { lat: 18.5987, lng: 73.7634 }
  },
  {
    id: 'loc-baner',
    name: 'Baner High Street',
    address: 'Baner Road, Near Balewadi High St',
    area: 'North-West Tech Hub',
    coordinates: { lat: 18.5590, lng: 73.7868 }
  },
  {
    id: 'loc-aundh',
    name: 'Aundh Circle',
    address: 'DP Road, Parihar Chowk, Aundh',
    area: 'Central-West Corridor',
    coordinates: { lat: 18.5580, lng: 73.8075 }
  },
  {
    id: 'loc-shivajinagar',
    name: 'Shivajinagar Hub',
    address: 'Near Old Bus Stand & Metro Interchange',
    area: 'Central Pune Core',
    coordinates: { lat: 18.5314, lng: 73.8446 }
  },
  {
    id: 'loc-koregaon',
    name: 'Koregaon Park (North Main Rd)',
    address: 'Lane 5, Koregaon Park',
    area: 'East-Central Premium Hub',
    coordinates: { lat: 18.5362, lng: 73.8940 }
  },
  {
    id: 'loc-kalyani',
    name: 'Kalyani Nagar',
    address: 'East Avenue, Kalyani Nagar',
    area: 'East Pune Tech Suburb',
    coordinates: { lat: 18.5492, lng: 73.9030 }
  },
  {
    id: 'loc-vimannagar',
    name: 'Viman Nagar / Airport Rd',
    address: 'Symbiosis Road, Viman Nagar',
    area: 'North-East IT Corridor',
    coordinates: { lat: 18.5679, lng: 73.9143 }
  },
  {
    id: 'loc-kharadi',
    name: 'Kharadi EON IT Park',
    address: 'EON Free Zone, Knowledge Park, Kharadi',
    area: 'East Mega IT Hub',
    coordinates: { lat: 18.5516, lng: 73.9352 }
  },
  {
    id: 'loc-magarpatta',
    name: 'Magarpatta Cybercity',
    address: 'Magarpatta City, Hadapsar',
    area: 'South-East IT Cluster',
    coordinates: { lat: 18.5158, lng: 73.9272 }
  },
  {
    id: 'loc-kothrud',
    name: 'Kothrud Stand',
    address: 'Paud Road, Kothrud',
    area: 'South-West Hub',
    coordinates: { lat: 18.5074, lng: 73.8077 }
  }
];

export const DEFAULT_PICKUP = LOCATIONS[0]; // Hinjawadi
export const DEFAULT_DESTINATION = LOCATIONS[8]; // Kharadi

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function getHaversineDistanceKm(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates estimated road driving distance taking city road winding factor (~1.25x)
 */
export function getDrivingDistanceKm(p1: GeoPoint, p2: GeoPoint): number {
  const straight = getHaversineDistanceKm(p1, p2);
  return Number((straight * 1.25).toFixed(1));
}

/**
 * Calculates estimated driving time in minutes assuming average city speed of 28-32 km/h
 */
export function getDrivingDurationMinutes(distanceKm: number): number {
  const averageSpeedKmH = 30;
  const timeMinutes = (distanceKm / averageSpeedKmH) * 60;
  return Math.max(3, Math.round(timeMinutes));
}

/**
 * Generates smooth realistic road waypoints between two points with road curvature
 */
export function generateRoutePoints(start: GeoPoint, end: GeoPoint, intermediateNoise = 12): GeoPoint[] {
  const points: GeoPoint[] = [];
  const dist = getHaversineDistanceKm(start, end);
  const steps = Math.max(16, Math.min(60, Math.round(dist * 5)));

  // Generate intermediate curve simulating main arterial highway & city roads
  const midLat = (start.lat + end.lat) / 2;
  const midLng = (start.lng + end.lng) / 2;
  
  // Perpendicular vector for natural road curve
  const dx = end.lng - start.lng;
  const dy = end.lat - start.lat;
  const perpX = -dy * 0.15;
  const perpY = dx * 0.15;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier curve with slight wobble for road reality
    const curveT = Math.sin(t * Math.PI);
    const wobble = Math.sin(t * 8 * Math.PI) * 0.001 * (intermediateNoise / 10);
    
    const lat = (1 - t) * start.lat + t * end.lat + curveT * perpY + wobble;
    const lng = (1 - t) * start.lng + t * end.lng + curveT * perpX + wobble;
    points.push({ lat, lng });
  }

  return points;
}

/**
 * Concatenates and optimizes multi-stop waypoints
 */
export function generateMultiStopRoute(stops: LocationItem[]): GeoPoint[] {
  if (stops.length < 2) return [];
  const allPoints: GeoPoint[] = [];

  for (let i = 0; i < stops.length - 1; i++) {
    const segment = generateRoutePoints(stops[i].coordinates, stops[i + 1].coordinates);
    if (i > 0) {
      allPoints.push(...segment.slice(1));
    } else {
      allPoints.push(...segment);
    }
  }

  return allPoints;
}

/**
 * Interpolates vehicle position along coordinate array based on progress (0 to 1)
 */
export function getPositionAlongPath(
  path: GeoPoint[],
  progress: number
): { position: GeoPoint; heading: number } {
  if (!path || path.length === 0) {
    return { position: { lat: 18.5913, lng: 73.7389 }, heading: 0 };
  }
  if (path.length === 1 || progress <= 0) {
    return { position: path[0], heading: 0 };
  }
  if (progress >= 1) {
    const last = path[path.length - 1];
    const prev = path[path.length - 2] || last;
    return {
      position: last,
      heading: calculateBearing(prev, last)
    };
  }

  const totalSegments = path.length - 1;
  const targetIndex = progress * totalSegments;
  const baseIndex = Math.floor(targetIndex);
  const remainder = targetIndex - baseIndex;

  const p1 = path[baseIndex];
  const p2 = path[Math.min(baseIndex + 1, totalSegments)];

  const lat = p1.lat + (p2.lat - p1.lat) * remainder;
  const lng = p1.lng + (p2.lng - p1.lng) * remainder;

  return {
    position: { lat, lng },
    heading: calculateBearing(p1, p2)
  };
}

/**
 * Calculates bearing angle in degrees between two coordinates
 */
export function calculateBearing(start: GeoPoint, end: GeoPoint): number {
  const dLng = ((end.lng - start.lng) * Math.PI) / 180;
  const lat1 = (start.lat * Math.PI) / 180;
  const lat2 = (end.lat * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;
  return bearing;
}

/**
 * Helper to compute bounding box for map auto-zoom
 */
export function getRouteBounds(points: GeoPoint[]): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  center: GeoPoint;
} {
  if (points.length === 0) {
    return { minLat: 18.5, maxLat: 18.6, minLng: 73.7, maxLng: 73.9, center: { lat: 18.55, lng: 73.8 } };
  }

  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
    center: {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2
    }
  };
}
