import { render, screen, fireEvent } from "@testing-library/react";
import { it, vi, expect, describe } from "vitest";
import Button from "../../src/components/Button";

describe("Button Component", () => {
  it("기본 클래스 이름과 커스텀 클래스 이름이 올바르게 적용되는지 확인", () => {
    const onClickMock = vi.fn();
    const { container } = render(
      <Button<string> onClick={onClickMock} className="custom-class">
        기본 버튼
      </Button>,
    );
    const button = container.querySelector("button");

    expect(button).toHaveClass("custom-class");
    expect(button).toHaveClass("w-full py-2 text-white rounded shadow-md");
  });

  it("클릭 시 onClick 핸들러가 호출되는지 확인", () => {
    const onClickMock = vi.fn();
    render(<Button<string> onClick={onClickMock}>호출 버튼</Button>);

    const button = screen.getByText("호출 버튼");
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("비활성화된 버튼 클릭 시 onClick 핸들러가 호출되지 않는지 확인", () => {
    const onClickMock = vi.fn();
    render(
      <Button<string> onClick={onClickMock} disabled>
        비활성화 버튼
      </Button>,
    );

    const button = screen.getByText("비활성화 버튼");
    fireEvent.click(button);

    expect(onClickMock).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it("클래스 이름이 제공되지 않았을 때 기본 스타일이 적용되는지 확인", () => {
    const { container } = render(
      <Button<string> onClick={() => {}}>기본 스타일 버튼</Button>,
    );
    const button = container.querySelector("button");

    expect(button).toHaveClass("bg-indigo-600 hover:bg-indigo-700");
  });

  it("제공된 클래스 이름이 버튼에 적용되는지 확인", () => {
    const onClickMock = vi.fn();
    const { container } = render(
      <Button<string> onClick={onClickMock} className="custom-class">
        커스텀 클래스 버튼
      </Button>,
    );
    const button = container.querySelector("button");

    expect(button).not.toHaveClass("bg-indigo-600 hover:bg-indigo-700");
    expect(button).toHaveClass("custom-class");
  });
});
