import { vi, beforeAll } from "vitest";
import "@testing-library/jest-dom";

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "Mocked response" }),
  }),
);

global.chrome = {
  storage: {
    session: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
  },
  runtime: {
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
} as unknown as typeof chrome;

beforeAll(() => {
  console.log("테스트 시작 전 초기화 작업");
});
