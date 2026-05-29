import { CaretDownIcon } from "@/components/icons/caret-down-icon";
import { SunriseIcon } from "@/components/icons/sunrise-icon";
import { SunsetIcon } from "@/components/icons/sunset-icon";
import { buildSunTimesDays } from "@/features/mountains-detail/modules/sun-times";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type WeatherAccordionProps = {
  latitude: number;
  longitude: number;
};

function SunriseSunset({
  sunrise,
  sunset,
}: {
  sunrise: string;
  sunset: string;
}): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-row items-center gap-1.5">
        <View className="flex-row items-center gap-1">
          <SunriseIcon />
          <Text className="text-label-subtler typo-body-3-medium">일출</Text>
        </View>
        <Text className="text-label-subtle typo-body-3-medium">{sunrise}</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <View className="flex-row items-center gap-1">
          <SunsetIcon />
          <Text className="text-label-subtler typo-body-3-medium">일몰</Text>
        </View>
        <Text className="text-label-subtle typo-body-3-medium">{sunset}</Text>
      </View>
    </View>
  );
}

export function WeatherAccordion({
  latitude,
  longitude,
}: WeatherAccordionProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const weatherDays = buildSunTimesDays(latitude, longitude);

  return (
    <View className="mx-5 mt-4 gap-[10px] rounded-[8px] bg-[#F9FAFB] px-4 py-[10px]">
      <Pressable
        className="flex-row items-center justify-between"
        onPress={() => setOpen(!open)}
      >
        <View className="mr-3 flex-1 flex-row items-center justify-between">
          <Text
            className={
              open
                ? "text-label-normal typo-body-3-semi-bold"
                : "text-label-subtle typo-body-3-medium"
            }
          >
            {weatherDays[0].label}
          </Text>
          <SunriseSunset
            sunrise={weatherDays[0].sunrise}
            sunset={weatherDays[0].sunset}
          />
        </View>
        <View
          className="w-5 items-center justify-center"
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        >
          <CaretDownIcon color="#A4ABC0" />
        </View>
      </Pressable>

      {open &&
        weatherDays.slice(1).map((day) => (
          <View
            key={day.label}
            className="h-5 flex-row items-center justify-between"
          >
            <View className="mr-3 flex-1 flex-row items-center justify-between">
              <Text className="text-label-subtle typo-body-3-medium">
                {day.label}
              </Text>
              <SunriseSunset sunrise={day.sunrise} sunset={day.sunset} />
            </View>
            <View className="w-5" />
          </View>
        ))}
    </View>
  );
}
