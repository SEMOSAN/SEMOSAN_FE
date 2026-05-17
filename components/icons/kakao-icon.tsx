import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";

type KakaoIconProps = { size?: number };

export function KakaoIcon({ size = 18 }: KakaoIconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <G clipPath="url(#kakao_clip)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.00002 0.601562C4.02917 0.601562 0 3.71452 0 7.55385C0 9.94159 1.5584 12.0465 3.93152 13.2985L2.93303 16.9461C2.84481 17.2684 3.21341 17.5252 3.49646 17.3385L7.87334 14.4498C8.2427 14.4854 8.61808 14.5062 9.00002 14.5062C13.9705 14.5062 17.9999 11.3934 17.9999 7.55385C17.9999 3.71452 13.9705 0.601562 9.00002 0.601562Z"
          fill="black"
        />
      </G>
      <Defs>
        <ClipPath id="kakao_clip">
          <Rect width="17.9999" height="18" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
