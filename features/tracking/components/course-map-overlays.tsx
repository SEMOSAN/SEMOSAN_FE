import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
} from "@mj-studio/react-native-naver-map";
import { ReactNode } from "react";

type Coord = { latitude: number; longitude: number };
type MarkerSize = { width: number; height: number };

type MarkerAnchor = { x: number; y: number };

type CourseMapOverlaysProps = {
  courseCoords: Coord[];
  startMarker?: ReactNode;
  endMarker?: ReactNode;
  summitMarker?: ReactNode;
  startMarkerSize?: MarkerSize;
  endMarkerSize?: MarkerSize;
  summitMarkerSize?: MarkerSize;
  startMarkerAnchor?: MarkerAnchor;
  endMarkerAnchor?: MarkerAnchor;
  summitMarkerAnchor?: MarkerAnchor;
};

const DEFAULT_MARKER_SIZE: MarkerSize = { width: 34, height: 45 };
const DEFAULT_ANCHOR: MarkerAnchor = { x: 0.5, y: 1 };

export function CourseMapOverlays({
  courseCoords,
  startMarker,
  endMarker,
  summitMarker,
  startMarkerSize = DEFAULT_MARKER_SIZE,
  endMarkerSize = DEFAULT_MARKER_SIZE,
  summitMarkerSize = DEFAULT_MARKER_SIZE,
  startMarkerAnchor = DEFAULT_ANCHOR,
  endMarkerAnchor = DEFAULT_ANCHOR,
  summitMarkerAnchor = DEFAULT_ANCHOR,
}: CourseMapOverlaysProps) {
  return (
    <>
      <NaverMapPathOverlay
        coords={courseCoords}
        width={6}
        color="#ffd40d"
        outlineWidth={1}
        outlineColor="#eab308"
      />
      {startMarker && (
        <NaverMapMarkerOverlay
          latitude={courseCoords[0].latitude}
          longitude={courseCoords[0].longitude}
          width={startMarkerSize.width}
          height={startMarkerSize.height}
          anchor={startMarkerAnchor}
        >
          {startMarker}
        </NaverMapMarkerOverlay>
      )}
      {endMarker && (
        <NaverMapMarkerOverlay
          latitude={courseCoords[courseCoords.length - 1].latitude}
          longitude={courseCoords[courseCoords.length - 1].longitude}
          width={endMarkerSize.width}
          height={endMarkerSize.height}
          anchor={endMarkerAnchor}
        >
          {endMarker}
        </NaverMapMarkerOverlay>
      )}
      {/* 정상 마커 — 코스 거리의 1/2 지점 */}
      {summitMarker && (
        <NaverMapMarkerOverlay
          latitude={courseCoords[Math.floor(courseCoords.length / 2)].latitude}
          longitude={courseCoords[Math.floor(courseCoords.length / 2)].longitude}
          width={summitMarkerSize.width}
          height={summitMarkerSize.height}
          anchor={summitMarkerAnchor}
        >
          {summitMarker}
        </NaverMapMarkerOverlay>
      )}
    </>
  );
}
