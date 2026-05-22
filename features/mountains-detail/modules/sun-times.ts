import SunCalc from "suncalc";

export type SunTimesDay = {
  label: string;
  sunrise: string;
  sunset: string;
};

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function buildSunTimesDays(latitude: number, longitude: number): SunTimesDay[] {
  const today = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const { sunrise, sunset } = SunCalc.getTimes(date, latitude, longitude);

    let label: string;
    if (i === 0) label = "오늘";
    else if (i === 1) label = "내일";
    else label = `${date.getMonth() + 1}/${date.getDate()}`;

    return { label, sunrise: formatTime(sunrise), sunset: formatTime(sunset) };
  });
}
