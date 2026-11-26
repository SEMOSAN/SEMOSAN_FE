import { fireEvent, render, screen } from "@testing-library/react-native";
import { ReportReasonSheet } from "../report-reason-sheet";

// 패키지가 제공하는 jest mock은 default export로 묶여 있다
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

const REASON_LABELS = ["스팸", "욕설/혐오", "음란/부적절", "허위정보", "기타"];

describe("ReportReasonSheet", () => {
  it("사유 5개를 모두 보여준다", () => {
    // 안드로이드 Alert은 버튼 3개까지만 렌더해 뒤쪽 사유가 잘렸다
    render(
      <ReportReasonSheet visible onDismiss={jest.fn()} onSubmit={jest.fn()} />,
    );

    for (const label of REASON_LABELS) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it("취소를 누르면 신고하지 않고 닫는다", () => {
    // 잘려나간 취소 버튼이 안드로이드에서 신고 전까지 못 나가는 원인이었다
    const onDismiss = jest.fn();
    const onSubmit = jest.fn();
    render(
      <ReportReasonSheet visible onDismiss={onDismiss} onSubmit={onSubmit} />,
    );

    fireEvent.press(screen.getByText("취소"));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("사유를 고르지 않으면 신고하기가 동작하지 않는다", () => {
    const onSubmit = jest.fn();
    render(
      <ReportReasonSheet visible onDismiss={jest.fn()} onSubmit={onSubmit} />,
    );

    fireEvent.press(screen.getByText("신고하기"));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("고른 사유의 enum 값으로 신고한다", () => {
    const onSubmit = jest.fn();
    render(
      <ReportReasonSheet visible onDismiss={jest.fn()} onSubmit={onSubmit} />,
    );

    fireEvent.press(screen.getByText("허위정보"));
    fireEvent.press(screen.getByText("신고하기"));

    expect(onSubmit).toHaveBeenCalledWith("FALSE_INFO");
  });

  it("닫은 뒤 다시 열면 선택이 초기화된다", () => {
    const onSubmit = jest.fn();
    const { rerender } = render(
      <ReportReasonSheet visible onDismiss={jest.fn()} onSubmit={onSubmit} />,
    );

    fireEvent.press(screen.getByText("스팸"));
    rerender(
      <ReportReasonSheet
        visible={false}
        onDismiss={jest.fn()}
        onSubmit={onSubmit}
      />,
    );
    rerender(
      <ReportReasonSheet visible onDismiss={jest.fn()} onSubmit={onSubmit} />,
    );

    fireEvent.press(screen.getByText("신고하기"));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
