import { it, expect, describe } from "vitest";
import base64ToFile from "../../src/utils/base64ToFile";

describe("base64ToFile", () => {
  const base64Image =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfoBxsRMyoxz1pgAACAAElEQVR42uz9d5xe510n/F/19HP36VXSqDdLsmzZki23FKfYDnEqIWFZSNgHfoENkAB5CAlPloXdAAsBwob07vTm3qssWZJl9TK9z93b6Vf5/XHkiROWJQkojjPn/YdfesmjmbnP3HN9rvq9oJQSJBKJRGLlQS/2N5BIJBKJF0cSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCJQGQSCQSK1QSAIlEIrFCkRf7G0gkLiEhhJRSSvkjf48QQgjFfw8hfLG/zUTixZEEQOIXkJSScw4hxBj/Xz4GAAAhlFImGZBYmeC/7BwlEi9Fy+045xwhFP9ZCHHmzNnTp09PTE6WSqXA9xnnO3bsfPuv/LKqqknTn1jhkhFA4hdB3JTHsz1xr//gwUNf+MKXnnjyqVKx5AdBEHh+4GGEAITgU58+f/78H773D/";
  const fileName = "test.png";
  const mimeType = "image/png";

  it("Base64 문자열로 File 생성", async () => {
    const base64String = base64Image.split(",")[1];
    const file = base64ToFile(base64String, fileName, mimeType);

    expect(file.name).toBe(fileName);
    expect(file.type).toBe(mimeType);

    const reader = new FileReader();
    const readFilePromise = new Promise((resolve) => {
      reader.onload = () => {
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      };
      reader.readAsArrayBuffer(file);
    });

    const result = await readFilePromise;
    const expectedContent = new Uint8Array(
      atob(base64String)
        .split("")
        .map((c) => c.charCodeAt(0)),
    );

    expect(result).toEqual(expectedContent);
  });

  it("빈 Base64 문자열 확인", () => {
    const emptyBase64 = "";
    const file = base64ToFile(emptyBase64, fileName, mimeType);

    expect(file.size).toBe(0);
  });

  it("유효하지 않은 Base64 입력 에러 확인", () => {
    const invalidBase64 = "INVALID_BASE64";

    expect(() => base64ToFile(invalidBase64, fileName, mimeType)).toThrow();
  });
});
