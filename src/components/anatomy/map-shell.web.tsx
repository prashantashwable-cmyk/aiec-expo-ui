import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
// Namespace import: maplibre-gl ships CJS, so named ESM imports come back
// undefined through Metro interop even though the typings permit them.
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { PUNE } from "@/contract/geo";
import { MAP_COLORS } from "@/design/palette";
import { useTheme } from "@/design/theme-provider";
import type { MapShellProps } from "./map-shell.types";

/**
 * Law 2 — the map is the app. Real OpenStreetMap tiles via MapLibre GL.
 *
 * Tiles come from OpenFreeMap: no API key, no registration, no request limit,
 * and attribution is added by MapLibre automatically. That matters beyond
 * cost — a metered basemap would make "every role opens onto a live map" a
 * line item that grows with every rider hired.
 *
 * The dark themes invert the tile canvas rather than loading a second style.
 * Markers live outside the canvas in their own DOM layer, so the universal pin
 * legend keeps its true colours: a red pin has to mean the same thing to the
 * rider and to the owner, and inverting it would break that.
 */

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

const DARK_THEMES = new Set(["slate", "command", "executive"]);

let cssInjected = false;

/** Runs now if the style is already parsed, otherwise once it is. */
function whenStyleReady(instance: maplibregl.Map, run: () => void) {
  if (instance.isStyleLoaded()) {
    run();
    return () => {};
  }
  const handler = () => run();
  instance.once("load", handler);
  return () => {
    instance.off("load", handler);
  };
}

function injectCss() {
  if (cssInjected || typeof document === "undefined") return;
  cssInjected = true;

  const style = document.createElement("style");
  style.textContent = `
    .aiec-map-dark .maplibregl-canvas {
      filter: invert(1) hue-rotate(180deg) brightness(0.92) contrast(0.9);
    }
    .aiec-map .maplibregl-ctrl-attrib {
      font-size: 10px;
      background: rgba(255,255,255,0.7);
    }
    .aiec-pin {
      border-radius: 9999px;
      border: 2px solid rgba(255,255,255,0.9);
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);
}

export function MapShell({
  center = PUNE,
  zoom = 13,
  pins = [],
  trail = [],
  heat = [],
  self,
  children,
  onPinPress,
}: MapShellProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  /**
   * Holds the loaded instance rather than a ready flag. React mounts effects
   * twice in development, so the first map is created, torn down and replaced.
   * With a boolean, markers were attached to the destroyed instance and never
   * re-attached to its replacement, because the flag never changed back.
   */
  const [liveMap, setLiveMap] = useState<maplibregl.Map | null>(null);
  const { theme } = useTheme();
  const dark = DARK_THEMES.has(theme);

  useEffect(() => {
    injectCss();
    if (!container.current || map.current) return;

    const instance = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: [center.lng, center.lat],
      zoom,
      attributionControl: { compact: true },
    });

    // Set immediately rather than on "load": markers only need the instance,
    // and waiting on an event that may already have fired left the map pinless.
    setLiveMap(instance);
    map.current = instance;

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      instance.remove();
      map.current = null;
      setLiveMap(null);
    };
    // Center and zoom are initial values only; panning afterwards is the user's.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Trail and heat are GL layers, so they sit under the tiles' labels. */
  useEffect(() => {
    const instance = liveMap;
    if (!instance) return;

    return whenStyleReady(instance, () => {
      if (instance.getLayer("aiec-trail")) instance.removeLayer("aiec-trail");
      if (instance.getSource("aiec-trail")) instance.removeSource("aiec-trail");

      if (trail.length < 2) return;
      instance.addSource("aiec-trail", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: trail.map((p) => [p.lng, p.lat]),
          },
        },
      });
      instance.addLayer({
        id: "aiec-trail",
        type: "line",
        source: "aiec-trail",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": MAP_COLORS.sales,
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });
    });
  }, [liveMap, trail]);

  useEffect(() => {
    const instance = liveMap;
    if (!instance) return;

    return whenStyleReady(instance, () => {
      if (instance.getLayer("aiec-heat")) instance.removeLayer("aiec-heat");
      if (instance.getSource("aiec-heat")) instance.removeSource("aiec-heat");

      if (heat.length === 0) return;
      instance.addSource("aiec-heat", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: heat.map((cell) => ({
            type: "Feature",
            properties: { intensity: cell.intensity, radius: cell.radiusMetres },
            geometry: { type: "Point", coordinates: [cell.lng, cell.lat] },
          })),
        },
      });
      instance.addLayer({
        id: "aiec-heat",
        type: "circle",
        source: "aiec-heat",
        paint: {
          "circle-color": "rgb(234 88 12)",
          "circle-opacity": ["*", ["get", "intensity"], 0.35],
          "circle-radius": [
            "interpolate",
            ["exponential", 2],
            ["zoom"],
            10,
            ["/", ["get", "radius"], 40],
            16,
            ["/", ["get", "radius"], 2],
          ],
        },
      });
    });
  }, [liveMap, heat]);

  /** Pins are DOM markers so the dark-mode canvas filter cannot recolour them. */
  useEffect(() => {
    const instance = liveMap;
    if (!instance) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    for (const pin of pins) {
      const el = document.createElement("div");
      el.className = "aiec-pin";
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.background = MAP_COLORS[pin.status];
      el.style.opacity = pin.foreign ? "0.4" : "1";
      el.style.cursor = onPinPress ? "pointer" : "default";
      el.setAttribute("aria-label", pin.id);
      if (onPinPress) el.onclick = () => onPinPress(pin.id);

      markers.current.push(
        new maplibregl.Marker({ element: el })
          .setLngLat([pin.lng, pin.lat])
          .addTo(instance),
      );
    }

    if (self) {
      const el = document.createElement("div");
      el.className = "aiec-pin";
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.background = MAP_COLORS.sales;
      el.style.boxShadow = "0 0 0 6px rgba(59,130,246,0.25)";
      el.setAttribute("aria-label", "self");
      markers.current.push(
        new maplibregl.Marker({ element: el })
          .setLngLat([self.lng, self.lat])
          .addTo(instance),
      );
    }
  }, [liveMap, pins, self, onPinPress]);

  return (
    <View className="flex-1 bg-surface">
      <div
        ref={container}
        className={`aiec-map ${dark ? "aiec-map-dark" : ""}`}
        style={{ position: "absolute", inset: 0 }}
      />
      <View className="absolute inset-0" pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}
