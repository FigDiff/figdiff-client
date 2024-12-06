import { render, fireEvent } from "@testing-library/react";
import { it, vi, expect, describe, beforeAll, afterAll } from "vitest";
import Login from "../../src/pages/Login";

describe("Login Component", () => {
  beforeAll(() => {
    global.chrome = {
      identity: {
        launchWebAuthFlow: vi.fn(),
      },
      runtime: {
        sendMessage: vi.fn(),
      },
    } as unknown as typeof chrome;
  });

  afterAll(() => {
    delete (global as any).chrome;
  });

  it("should handle successful OAuth flow", () => {
    const mockLaunchWebAuthFlow = vi.fn(
      (_, callback?: (responseUrl?: string) => void) => {
        const mockRedirectUrl =
          "https://extension-id.chromiumapp.org/?code=someCode";
        if (callback) {
          callback(mockRedirectUrl);
        }
        return Promise.resolve(mockRedirectUrl);
      },
    );

    global.chrome.identity.launchWebAuthFlow = mockLaunchWebAuthFlow;

    const mockSendMessage = vi.fn();
    global.chrome.runtime.sendMessage = mockSendMessage;

    const { getByText } = render(<Login />);

    const loginButton = getByText("Figma 계정으로 로그인");
    fireEvent.click(loginButton);

    expect(mockLaunchWebAuthFlow).toHaveBeenCalled();
    expect(mockLaunchWebAuthFlow).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("https://www.figma.com/oauth"),
        interactive: true,
      }),
      expect.any(Function),
    );

    expect(mockSendMessage).toHaveBeenCalledWith({
      action: "oauth2",
      code: "someCode",
      CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
      CLIENT_SECRET: import.meta.env.VITE_CLIENT_KEY,
    });
  });

  it("should handle OAuth error flow", () => {
    const mockLaunchWebAuthFlow = vi.fn(
      (_, callback?: (responseUrl?: string) => void) => {
        const mockRedirectUrl =
          "https://extension-id.chromiumapp.org/?error=access_denied";
        if (callback) {
          callback(mockRedirectUrl);
        }
        return Promise.resolve(mockRedirectUrl);
      },
    );

    global.chrome.identity.launchWebAuthFlow = mockLaunchWebAuthFlow;

    const spyConsoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getByText } = render(<Login />);

    const loginButton = getByText("Figma 계정으로 로그인");
    fireEvent.click(loginButton);

    expect(spyConsoleError).toHaveBeenCalledWith("Error during authentication");

    spyConsoleError.mockRestore();
  });
});
