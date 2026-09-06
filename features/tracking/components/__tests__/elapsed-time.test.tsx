import { act, render, screen } from "@testing-library/react-native";
import { ElapsedTime } from "../elapsed-time";

const refOf = (seconds: number) => ({ current: seconds });

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("ElapsedTime", () => {
  it("ref의 현재 값을 시:분:초로 보여준다", () => {
    render(<ElapsedTime secondsRef={refOf(3661)} running={false} />);
    expect(screen.getByText("01:01:01")).toBeTruthy();
  });

  it("진행 중이면 1초마다 ref를 다시 읽는다", () => {
    const ref = refOf(0);
    render(<ElapsedTime secondsRef={ref} running />);
    expect(screen.getByText("00:00:00")).toBeTruthy();

    ref.current = 5;
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("00:00:05")).toBeTruthy();
  });

  it("멈춰 있으면 ref가 바뀌어도 다시 그리지 않는다", () => {
    const ref = refOf(10);
    render(<ElapsedTime secondsRef={ref} running={false} />);

    ref.current = 99;
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText("00:00:10")).toBeTruthy();
  });

  it("언마운트되면 타이머를 정리한다", () => {
    const ref = refOf(0);
    const { unmount } = render(<ElapsedTime secondsRef={ref} running />);
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
