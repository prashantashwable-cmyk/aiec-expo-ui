import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { PUNE } from "@/contract/geo";
import { MAP_COLORS } from "@/design/palette";
import type { GeoPoint, MapShellProps } from "./map-shell.types";

/**
 * Native MapShell — a schematic placeholder, not the real map.
 *
 * The web build renders genuine OpenStreetMap tiles through MapLibre GL (see
 * map-shell.web.tsx). Native MapLibre needs `@maplibre/maplibre-react-native`,
 * which requires a custom dev client and cannot run in Expo Go, so this keeps
 * the identical props and real lng/lat maths until that build exists.
 *
 * It is deliberately obvious that this is a diagram rather than a map. A
 * placeholder that looked convincing would be worse: someone would ship it.
 */

const METRES_PER_DEGREE_LAT = 111_320;

function metresPerDegreeLng(lat: number) {
  return METRES_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180);
}

/** Local equirectangular projection. Accurate enough across a single city. */
function project(
  point: GeoPoint,
  center: GeoPoint,
  metresPerPixel: number,
  width: number,
  height: number,
) {
  const dxMetres = (point.lng - center.lng) * metresPerDegreeLng(center.lat);
  const dyMetres = (point.lat - center.lat) * METRES_PER_DEGREE_LAT;
  return {
    x: width / 2 + dxMetres / metresPerPixel,
    y: height / 2 - dyMetres / metresPerPixel,
  };
}

export function MapShell({
  center = PUNE,
  zoom = 13,
  pins = [],
  trail = [],
  heat = [],
  self,
  children,
}: MapShellProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const { width: w, height: h } = size;
  // Roughly matches web-mercator scale at this latitude for the given zoom.
  const metresPerPixel = (156543.03 * Math.cos((center.lat * Math.PI) / 180)) / 2 ** zoom;

  const to = (p: GeoPoint) => project(p, center, metresPerPixel, w, h);

  const trailPath = trail
    .map((p, i) => {
      const { x, y } = to(p);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <View className="flex-1 bg-surface" onLayout={onLayout}>
      {w > 0 && h > 0 ? (
        <Svg width={w} height={h} accessibilityLabel="Map">
          {[0.18, 0.42, 0.68, 0.9].map((y) => (
            <Rect
              key={`h${y}`}
              x={0}
              y={y * h}
              width={w}
              height={8}
              fill="rgba(120,120,110,0.14)"
            />
          ))}
          {[0.22, 0.55, 0.82].map((x) => (
            <Rect
              key={`v${x}`}
              x={x * w}
              y={0}
              width={8}
              height={h}
              fill="rgba(120,120,110,0.14)"
            />
          ))}

          {heat.map((cell, i) => {
            const { x, y } = to(cell);
            return (
              <Circle
                key={`heat${i}`}
                cx={x}
                cy={y}
                r={cell.radiusMetres / metresPerPixel}
                fill={`rgba(234,88,12,${0.1 + cell.intensity * 0.3})`}
              />
            );
          })}

          {trail.length > 1 ? (
            <Path
              d={trailPath}
              stroke={MAP_COLORS.sales}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null}

          {pins.map((pin) => {
            const { x, y } = to(pin);
            return (
              <Circle
                key={pin.id}
                cx={x}
                cy={y}
                r={7}
                fill={MAP_COLORS[pin.status]}
                opacity={pin.foreign ? 0.35 : 1}
              />
            );
          })}

          {self
            ? (() => {
                const { x, y } = to(self);
                return (
                  <>
                    <Circle cx={x} cy={y} r={14} fill="rgba(59,130,246,0.25)" />
                    <Circle cx={x} cy={y} r={7} fill={MAP_COLORS.sales} />
                  </>
                );
              })()
            : null}
        </Svg>
      ) : null}

      <View className="absolute inset-0" pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}
