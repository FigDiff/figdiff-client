import { it, expect, describe } from "vitest";
import { isValidFigmaUrl } from "../../src/utils/utils.ts";

describe("isValidFigmaUrl", () => {
  it("올바른 Figma URL을 인식 확인", () => {
    const validUrl =
      "https://www.figma.com/design/AAlEsMxaY03wd11SrdS8Ld/testcase?node-id=1202-1314&node-type=frame&t=Y4sNhlQ63OpXMEN8-0";
    expect(isValidFigmaUrl(validUrl)).toBe(true);
  });

  it("올바르지 않은 Figma URL을 거부", () => {
    const invalidUrl =
      "https://www.figma.com/invalid-path/abcdefghijklmno1234567/test";
    expect(isValidFigmaUrl(invalidUrl)).toBe(false);
  });

  it("빈 문자열에 대해 false를 반환", () => {
    expect(isValidFigmaUrl("")).toBe(false);
  });

  it("URL에 잘못된 도메인이 포함되었을 때 false를 반환", () => {
    const invalidDomain =
      "https://www.example.com/design/abcdefghijklmno1234567/test";
    expect(isValidFigmaUrl(invalidDomain)).toBe(false);
  });

  it("node-id와 t 매개변수 없을때 유효하지 않은 URL로 처리", () => {
    const validUrlWithoutParams =
      "https://www.figma.com/design/abcdefghijklmno1234567/";
    expect(isValidFigmaUrl(validUrlWithoutParams)).toBe(false);
  });

  it("허용되지 않은 특수 문자가 포함된 URL을 거부", () => {
    const invalidUrl =
      "https://www.figma.com/design/AAlEsMxaY03@wd11SrdS8Ld/testcase?node-id=1202-1314&node-type=frame&t=Y4sNhlQ63OpXMEN8-0";
    expect(isValidFigmaUrl(invalidUrl)).toBe(false);
  });
});
