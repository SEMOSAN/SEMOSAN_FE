import { useEffect, useReducer, type RefObject } from "react";
import { Text } from "react-native";
import { TRACKING_TIMER_STYLE, formatElapsedTime } from "../constants";

type Props = {
  /** 경과 초의 원본. 화면 전체 리렌더를 막으려고 state 대신 ref로 받는다 */
  secondsRef: RefObject<number>;
  /** 진행 중일 때만 1초마다 다시 그린다 */
  running: boolean;
};

export function ElapsedTime({ secondsRef, running }: Props) {
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <Text className="text-label-normal" style={TRACKING_TIMER_STYLE}>
      {formatElapsedTime(secondsRef.current)}
    </Text>
  );
}
