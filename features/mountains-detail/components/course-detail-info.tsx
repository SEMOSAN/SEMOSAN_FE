import { DotMarkerIcon } from "@/components/icons/dot-marker-icon";
import { FlagMarkerIcon } from "@/components/icons/flag-marker-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { CourseBadge } from "@/features/mountains/components/course-badge";
import { parseCoursePolyline } from "@/features/tracking/utils/parse-course-polyline";
import { formatDuration } from "@/modules/format-duration";
import { CourseDetailResponse } from "@/types/api.generated";
import { getCenterCoordinate } from "@/utils/get-center-coordinate";
import { getZoomForCoords } from "@/utils/get-zoom-for-coords";
import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

const DIFFICULTY_LABEL: Record<
  NonNullable<CourseDetailResponse["difficulty"]>,
  string
> = {
  EASY: "쉬움",
  NORMAL: "보통",
  HARD: "어려움",
};

type CourseDetailInfoProps = {
  course: CourseDetailResponse;
};

export function CourseDetailInfo({ course }: CourseDetailInfoProps) {
  const courseCoords = useMemo(
    () => parseCoursePolyline(course.polyline),
    [course.polyline],
  );
  const center = getCenterCoordinate(courseCoords);
  const zoom = getZoomForCoords(courseCoords, 1.5);

  const statRows = [
    [
      {
        label: "거리",
        value:
          typeof course.distance === "number"
            ? `${(course.distance / 1000).toFixed(1)}km`
            : "-",
      },
      {
        label: "난이도",
        value: course.difficulty ? DIFFICULTY_LABEL[course.difficulty] : "-",
      },
      {
        label: "소요시간",
        value:
          typeof course.duration === "number"
            ? formatDuration(course.duration)
            : "-",
      },
    ],
    [
      { label: "고도", value: "-" },
      { label: "오르막길", value: "-" },
      { label: "내리막길", value: "-" },
    ],
  ];

  return (
    <>
      <View className="mx-5 h-[200px] overflow-hidden rounded-[20px]">
        {center ? (
          <NaverMapView
            style={{ flex: 1 }}
            camera={{
              latitude: center.latitude,
              longitude: center.longitude,
              zoom,
            }}
            isShowZoomControls={false}
            isScrollGesturesEnabled={false}
            isZoomGesturesEnabled={false}
            isRotateGesturesEnabled={false}
            isTiltGesturesEnabled={false}
          >
            {courseCoords.length > 1 && (
              <>
                <NaverMapPathOverlay
                  coords={courseCoords}
                  width={6}
                  color="#ffd40d"
                  outlineWidth={1}
                  outlineColor="#eab308"
                />
                <NaverMapMarkerOverlay
                  latitude={courseCoords[0].latitude}
                  longitude={courseCoords[0].longitude}
                  width={12}
                  height={12}
                  anchor={{ x: 0.5, y: 0.73 }}
                >
                  <DotMarkerIcon fill="#507EF4" stroke="#2563EB" />
                </NaverMapMarkerOverlay>
                <NaverMapMarkerOverlay
                  latitude={courseCoords[courseCoords.length - 1].latitude}
                  longitude={courseCoords[courseCoords.length - 1].longitude}
                  width={12}
                  height={12}
                  anchor={{ x: 0.5, y: 0.73 }}
                >
                  <DotMarkerIcon />
                </NaverMapMarkerOverlay>
                {/* 정상 마커 — 코스 거리의 1/2 지점 */}
                <NaverMapMarkerOverlay
                  latitude={courseCoords[Math.floor(courseCoords.length / 2)].latitude}
                  longitude={courseCoords[Math.floor(courseCoords.length / 2)].longitude}
                  width={22}
                  height={30}
                  anchor={{ x: 0.3, y: 1 }}
                >
                  <FlagMarkerIcon />
                </NaverMapMarkerOverlay>
              </>
            )}
          </NaverMapView>
        ) : (
          <View className="flex-1 bg-fill-stronger" />
        )}
      </View>

      {/* Course info */}
      <View className="gap-[10px] px-5 pt-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-[10px]">
            {course.difficulty && (
              <CourseBadge difficulty={course.difficulty} />
            )}
            <Text className="text-label-normal typo-heading-1-semi-bold">
              {course.name}
            </Text>
          </View>
          <Pressable hitSlop={8}>
            <HeartIcon />
          </Pressable>
        </View>

        {/* Start / End */}
        <View className="gap-[4px]">
          <View className="flex-row items-center gap-[8px]">
            <View
              className="size-[10px] rounded-full"
              style={{ backgroundColor: "#507EF4" }}
            />
            <Text className="text-label-subtle typo-body-2-normal-semi-bold">
              출발
            </Text>
            <Text className="text-label-subtler typo-body-2-normal-regular">
              {course.startName ?? "-"}
            </Text>
          </View>
          <View className="flex-row items-center gap-[8px]">
            <View
              className="size-[10px] rounded-full"
              style={{ backgroundColor: "#FF5249" }}
            />
            <Text className="text-label-subtle typo-body-2-normal-semi-bold">
              도착
            </Text>
            <Text className="text-label-subtler typo-body-2-normal-regular">
              {course.endName ?? "-"}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats grid */}
      <View className="mt-6 gap-[6px]">
        {statRows.map((row, rowIdx) => (
          <View key={rowIdx} className="flex-row justify-center gap-1">
            {row.map(({ label, value }) => (
              <View
                key={label}
                className="w-[109px] items-center justify-center gap-[6px] py-2"
              >
                <Text className="text-label-subtler typo-body-3-medium">
                  {label}
                </Text>
                <Text className="text-label-normal typo-heading-1-semi-bold">
                  {value}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </>
  );
}
