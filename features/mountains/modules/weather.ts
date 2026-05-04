export type WeatherDay = {
  label: string;
  sunrise: string;
  sunset: string;
};

export function buildWeatherDays(): WeatherDay[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    let label: string;
    if (i === 0) {
      label = "오늘";
    } else if (i === 1) {
      label = "내일";
    } else {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      label = `${d.getMonth() + 1}/${d.getDate()}`;
    }
    return { label, sunrise: "05:01", sunset: "19:01" };
  });
}
