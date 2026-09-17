import type { MapStatus } from "@/design/themes";

/**
 * Real coordinates. The schematic map used a normalised 0..1 space, which was
 * fine while the map was a drawing but meaningless against actual tiles.
 *
 * Everything here is genuine Pune geography, so a rider pin sits on the street
 * it claims to. Law 11 — real map, real GPS, from day one.
 */

export interface GeoPoint {
  lng: number;
  lat: number;
}

export interface GeoPin extends GeoPoint {
  id: string;
  status: MapStatus;
  /** Another rider's pin: dimmed, so two riders never capture one shaft. */
  foreign?: boolean;
}

export interface GeoHeatCell extends GeoPoint {
  radiusMetres: number;
  /** 0..1, the opportunity score the AI gives this grid cell. */
  intensity: number;
}

export const PUNE: GeoPoint = { lng: 73.8567, lat: 18.5204 };

export const ZONES: Record<string, GeoPoint & { name: string }> = {
  KOT: { lng: 73.8077, lat: 18.5074, name: "Kothrud" },
  BAN: { lng: 73.7868, lat: 18.559, name: "Baner" },
  WAK: { lng: 73.7898, lat: 18.5975, name: "Wakad" },
  HAD: { lng: 73.926, lat: 18.5089, name: "Hadapsar" },
  SHI: { lng: 73.8478, lat: 18.5308, name: "Shivajinagar" },
};

export const SITES: Record<string, GeoPoint> = {
  "MH-PUN-KOT-LEAD-0447-J": { lng: 73.8077, lat: 18.5074 },
  "MH-PUN-KOT-LEAD-0441-B": { lng: 73.812, lat: 18.5101 },
  "MH-PUN-KOT-LEAD-0432-P": { lng: 73.8041, lat: 18.5042 },
  "MH-PUN-KOT-LEAD-0428-X": { lng: 73.8152, lat: 18.5021 },
  "MH-PUN-BAN-LEAD-0398-K": { lng: 73.7868, lat: 18.559 },
  "MH-PUN-BAN-LEAD-0377-D": { lng: 73.7902, lat: 18.5556 },
  "MH-PUN-KOT-LIFT-0089-K": { lng: 73.8077, lat: 18.5074 },
  "MH-PUN-BAN-LIFT-0091-C": { lng: 73.7868, lat: 18.559 },
  "MH-PUN-HAD-CONT-0112-R": { lng: 73.926, lat: 18.5089 },
};

/** The rider's route so far today, through Kothrud. */
export const RIDER_TRAIL: GeoPoint[] = [
  { lng: 73.8181, lat: 18.4979 },
  { lng: 73.8148, lat: 18.5017 },
  { lng: 73.8119, lat: 18.5046 },
  { lng: 73.8094, lat: 18.5061 },
  { lng: 73.8077, lat: 18.5074 },
];

export const RIDER_SELF: GeoPoint = { lng: 73.8077, lat: 18.5074 };

/** Predicted high-opportunity cells, scored per 250 m grid square. */
export const RIDER_HEAT: GeoHeatCell[] = [
  { lng: 73.8055, lat: 18.5095, radiusMetres: 600, intensity: 0.9 },
  { lng: 73.8145, lat: 18.5028, radiusMetres: 450, intensity: 0.45 },
];

export const RIDER_PINS: GeoPin[] = [
  { id: "MH-PUN-KOT-LEAD-0447-J", ...SITES["MH-PUN-KOT-LEAD-0447-J"], status: "new" },
  { id: "MH-PUN-KOT-LEAD-0441-B", ...SITES["MH-PUN-KOT-LEAD-0441-B"], status: "sales" },
  { id: "MH-PUN-KOT-LEAD-0432-P", ...SITES["MH-PUN-KOT-LEAD-0432-P"], status: "won" },
  { id: "MH-PUN-KOT-LEAD-0428-X", ...SITES["MH-PUN-KOT-LEAD-0428-X"], status: "lost" },
  { id: "MH-PUN-BAN-LEAD-0398-K", ...SITES["MH-PUN-BAN-LEAD-0398-K"], status: "new", foreign: true },
  { id: "MH-PUN-BAN-LEAD-0377-D", ...SITES["MH-PUN-BAN-LEAD-0377-D"], status: "new", foreign: true },
];

/** Admin sees the whole city, so these spread across real Pune wards. */
export const CITY_PINS: GeoPin[] = [
  { id: "a1", lng: 73.926, lat: 18.5089, status: "blocked" },
  { id: "a2", lng: 73.8077, lat: 18.5074, status: "installing" },
  { id: "a3", lng: 73.7868, lat: 18.559, status: "won" },
  { id: "a4", lng: 73.7898, lat: 18.5975, status: "transit" },
  { id: "a5", lng: 73.8478, lat: 18.5308, status: "complete" },
  { id: "a6", lng: 73.8812, lat: 18.5089, status: "sales" },
  { id: "a7", lng: 73.8331, lat: 18.4899, status: "new" },
  { id: "a8", lng: 73.9143, lat: 18.5624, status: "transit" },
];

export const SALES_PIN_SET: GeoPin[] = [
  { id: "s1", ...SITES["MH-PUN-KOT-LEAD-0447-J"], status: "new" },
  { id: "s2", ...SITES["MH-PUN-KOT-LEAD-0441-B"], status: "sales" },
  { id: "s3", ...SITES["MH-PUN-KOT-LEAD-0432-P"], status: "won" },
  { id: "s4", ...SITES["MH-PUN-BAN-LEAD-0398-K"], status: "lost" },
];

export const QC_PINS: GeoPin[] = [
  { id: "MH-PUN-KOT-QCIN-0181-F", ...ZONES.KOT, status: "won" },
  { id: "MH-PUN-BAN-QCIN-0182-K", ...ZONES.BAN, status: "installing" },
  { id: "MH-PUN-HAD-QCIN-0183-R", ...ZONES.HAD, status: "won" },
];

/** A container on the road from the supplier yard toward Kothrud. */
export const CONTAINER_ROUTE: GeoPoint[] = [
  { lng: 73.9143, lat: 18.5624 },
  { lng: 73.8812, lat: 18.5442 },
  { lng: 73.8478, lat: 18.5308 },
  { lng: 73.8241, lat: 18.5151 },
  { lng: 73.8077, lat: 18.5074 },
];

export const FLEET_PINS: GeoPin[] = [
  { id: "f1", lng: 73.8478, lat: 18.5308, status: "transit" },
  { id: "f2", lng: 73.8812, lat: 18.5442, status: "transit" },
  { id: "f3", lng: 73.7868, lat: 18.559, status: "complete" },
];

export const TECHNICIAN_PINS: GeoPin[] = [
  { id: "MH-PUN-KOT-LIFT-0089-K", ...SITES["MH-PUN-KOT-LIFT-0089-K"], status: "installing" },
  { id: "MH-PUN-BAN-LIFT-0091-C", ...SITES["MH-PUN-BAN-LIFT-0091-C"], status: "won" },
];
