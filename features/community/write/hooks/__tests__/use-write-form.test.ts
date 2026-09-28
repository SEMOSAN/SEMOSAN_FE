import { act, renderHook } from "@testing-library/react-native";
import { useWriteForm } from "../use-write-form";

describe("useWriteForm", () => {
  it("제목과 본문이 모두 있어야 제출할 수 있다", () => {
    const { result } = renderHook(() => useWriteForm("제목", "본문"));
    expect(result.current.isSubmittable).toBe(true);
  });

  it("본문이 비어 있으면 제출을 막는다", () => {
    const { result } = renderHook(() => useWriteForm("제목", ""));
    expect(result.current.isSubmittable).toBe(false);
  });

  it("제목이 비어 있으면 제출을 막는다", () => {
    const { result } = renderHook(() => useWriteForm("", "본문"));
    expect(result.current.isSubmittable).toBe(false);
  });

  it("공백만 입력한 본문은 비어 있는 것으로 본다", () => {
    const { result } = renderHook(() => useWriteForm("제목", "   \n  "));
    expect(result.current.isSubmittable).toBe(false);
  });

  it("본문을 지우면 다시 제출할 수 없게 된다", () => {
    const { result } = renderHook(() => useWriteForm("제목", "본문"));
    act(() => result.current.setBody(""));
    expect(result.current.isSubmittable).toBe(false);
  });
});
