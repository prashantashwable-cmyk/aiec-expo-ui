import type { ReactNode } from "react";

import type { GeoHeatCell, GeoPin, GeoPoint } from "@/contract/geo";

export type { GeoHeatCell, GeoPin, GeoPoint };

export interface MapShellProps {
  /** Defaults to central Pune. */
  center?: GeoPoint;
  zoom?: number;
  pins?: GeoPin[];
  /** The route travelled, drawn behind the rider. */
  trail?: GeoPoint[];
  heat?: GeoHeatCell[];
  /** The live position of the person holding the phone. */
  self?: GeoPoint;
  /** Overlays drawn above the map: chips, legends, controls. */
  children?: ReactNode;
  onPinPress?: (id: string) => void;
}
