import { render, screen } from "@testing-library/react";
import { it, vi, expect, describe, beforeEach } from "vitest";
import ProgressBar from "../../src/components/ProgressBar";

describe("ProgressBar", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    global.chrome.tabs.query.mockImplementation((_, callback) => {
      callback([{ id: 1 }]);
    });

    global.chrome.storage.session.get.mockImplementation((_, callback) => {
      const mockData = {
        session_1: {
          progress: 80,
          isDataFetched: false,
          isDataFetchError: false,
          annotatedImage: "",
          setCurrentStage: "다른 좌표를 찾고 있습니다!",
        },
      };

      callback(mockData);
    });
  });

  it("초기 props로 렌더링 확인", () => {
    render(<ProgressBar progress={0} currentStage="분석 준비중입니다" />);

    expect(screen.getByText("0% 완료")).toBeInTheDocument();
    expect(screen.getByText("분석 준비중입니다")).toBeInTheDocument();
  });

  it("마운트 해제 시 애니메이션 프레임 정리", () => {
    const { unmount } = render(
      <ProgressBar progress={80} currentStage="다른 좌표를 찾고 있습니다!" />,
    );
    const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame");

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });
});
