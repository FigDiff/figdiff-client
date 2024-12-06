import { render, screen, fireEvent } from "@testing-library/react";
import { it, vi, expect, describe, beforeEach } from "vitest";
import { isValidFigmaUrl } from "../../src/utils/utils";
import Main from "../../src/pages/Main";

vi.mock("../../src/utils/utils", () => ({
  isValidFigmaUrl: vi.fn().mockReturnValue(true),
}));

describe("Main", () => {
  beforeEach(() => {
    global.chrome = {
      tabs: {
        query: vi.fn((_query, callback) =>
          callback([{ id: 1, url: "http://example.com" }]),
        ),
      },
      storage: {
        session: {
          get: vi.fn((_keys, callback) =>
            callback({ session_1: { isLoading: false } }),
          ),
          set: vi.fn(),
        },
        local: {
          get: vi.fn((_key, callback) =>
            callback({ data: { access_token: "fake-token" } }),
          ),
        },
      },
      runtime: {
        sendMessage: vi.fn(),
      },
    } as unknown as typeof chrome;
  });

  it("초기 UI 렌더링 확인", () => {
    render(<Main />);

    expect(screen.getByText("FigDiff")).toBeInTheDocument();
  });

  it("URL 입력 검증 및 상태 업데이트", () => {
    render(<Main />);

    const urlInput = screen.getByPlaceholderText(
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png",
    );
    fireEvent.change(urlInput, { target: { value: "https://figma.com" } });

    expect(isValidFigmaUrl).toHaveBeenCalledWith("https://figma.com");
    expect(screen.getByRole("button", { name: "제출하기" })).toBeEnabled();
  });

  it("유효하지 않은 URL에 대한 에러 메시지 표시", () => {
    isValidFigmaUrl.mockReturnValueOnce(false);

    render(<Main />);

    const urlInput = screen.getByPlaceholderText(
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png",
    );
    fireEvent.change(urlInput, { target: { value: "invalid-url" } });

    expect(screen.getByText("유효한 URL이 아닙니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "제출하기" })).toBeDisabled();
  });

  it("Web 토글 버튼 확인", () => {
    render(<Main />);

    const webButton = screen.getByRole("button", { name: "Web" });
    fireEvent.click(webButton);

    expect(screen.getByText("Web에서 내역 확인하기")).toBeInTheDocument();

    fireEvent.click(webButton);

    expect(screen.queryByText("FigDiff 사용방법")).toBeInTheDocument();
  });

  it("버튼 클릭 시 FigDiff 웹사이트 새 탭 확인", () => {
    const mockOpen = vi.fn();
    global.open = mockOpen;

    render(<Main />);

    const webButton = screen.getByRole("button", { name: "Web" });
    fireEvent.click(webButton);

    const navigateButton = screen.getByText("FigDiff 웹페이지로 이동");
    fireEvent.click(navigateButton);

    expect(mockOpen).toHaveBeenCalledWith("https://figdiff.com/", "_blank");
  });

  it("버튼 클릭 시 유효한 데이터를 포함한 메시지 전송", async () => {
    render(<Main />);

    const urlInput = screen.getByPlaceholderText(
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png",
    );
    fireEvent.change(urlInput, {
      target: {
        value:
          "https://www.figma.com/design/AAlEsMxaY03wd11SrdS8Ld/testcase?node-id=1202-1314&node-type=frame&t=EWLZAjMpbLLCiulu-0",
      },
    });

    expect(screen.getByRole("button", { name: "제출하기" })).toBeEnabled();
  });
});
