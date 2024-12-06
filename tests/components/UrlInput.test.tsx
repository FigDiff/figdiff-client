import { render, screen, fireEvent } from "@testing-library/react";
import { it, vi, expect, describe } from "vitest";
import UrlInput from "../../src/components/UrlInput";

describe("UrlInput Component", () => {
  it("올바른 placeholder가 렌더링되는지 확인", () => {
    const placeholder =
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png";

    render(
      <UrlInput
        value=""
        onChange={() => {}}
        isValid={null}
        placeholder={placeholder}
      />,
    );

    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).toBeInTheDocument();
  });

  it("value 속성이 올바르게 렌더링되는지 확인", () => {
    const value = "https://example.com";
    const placeholder =
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png";

    render(
      <UrlInput
        value={value}
        onChange={() => {}}
        isValid={true}
        placeholder={placeholder}
      />,
    );

    const inputElement = screen.getByDisplayValue(value);
    expect(inputElement).toBeInTheDocument();
  });

  it("값이 변경될 때 onChange 핸들러가 호출되는지 확인", () => {
    const handleChange = vi.fn();
    const placeholder =
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png";

    render(
      <UrlInput
        value=""
        onChange={handleChange}
        isValid={null}
        placeholder={placeholder}
      />,
    );

    const inputElement = screen.getByPlaceholderText(
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png",
    );
    fireEvent.change(inputElement, {
      target: { value: "https://example.com" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("isValid가 null일 때 올바른 클래스가 적용되는지 확인", () => {
    const placeholder =
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png";

    render(
      <UrlInput
        value=""
        onChange={() => {}}
        isValid={null}
        placeholder={placeholder}
      />,
    );

    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).toHaveClass("focus:ring-green-500");
  });

  it("isValid가 true일 때 올바른 클래스가 적용되는지 확인", () => {
    const placeholder =
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png";

    render(
      <UrlInput
        value="https://example.com"
        onChange={() => {}}
        isValid={true}
        placeholder={placeholder}
      />,
    );

    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).toHaveClass(
      "border-green-500",
      "focus:ring-green-500",
    );
  });

  it("isValid가 false일 때 올바른 클래스가 적용되는지 확인", () => {
    const placeholder =
      "https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png";

    render(
      <UrlInput
        value="invalid-url"
        onChange={() => {}}
        isValid={false}
        placeholder={placeholder}
      />,
    );

    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).toHaveClass("border-red-500", "focus:ring-red-500");
  });
});
