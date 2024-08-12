import axios from "axios";
import base64ToFile from "../src/utils/base64ToFile";

chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "oauth2":
      handleGetAccessToken(message);
      break;
    case "fetchDiffData":
      handleFetchDiffData(message);
      break;
    case "takeScreenShot":
      handleTakeScreenShot(message);
      break;
  }

  return true;
});

async function handleGetAccessToken(message: {
  action: string;
  code: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}) {
  const { code, CLIENT_ID, CLIENT_SECRET } = message;
  const URL = "https://www.figma.com/api/oauth/token";

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: `https://${chrome.runtime.id}.chromiumapp.org/`,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching token: ${response.statusText}`);
    }

    const data = await response.json();

    chrome.storage.local.set({ data }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting data:", chrome.runtime.lastError);
      }
    });
  } catch (error) {
    console.error("Error fetching token:", error);
  }
}

async function handleFetchDiffData(message: {
  action: string;
  figmaUrl: string;
  accessToken: string;
  SERVER_URL: string;
  tabId: number;
  tabUrl: string;
}) {
  try {
    const { figmaUrl, accessToken, SERVER_URL, tabId, tabUrl } = message;

    const payload = {
      tabUrl,
      figmaUrl,
      accessToken,
    };

    const response = await axios.post(`${SERVER_URL}/figma-data`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["renderDifferences.js"],
      },
      () => {
        chrome.tabs.sendMessage(tabId, {
          action: "renderDifferences",
          data,
        });
      },
    );
  } catch (error) {
    chrome.runtime.sendMessage({ action: "serverError" });

    console.error("An error occurred:", error);
  }
}

async function handleTakeScreenShot(message: { SERVER_URL: string }) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id;
    const tabUrl = tabs[0].url;

    const userId = await new Promise((resolve) => {
      chrome.storage.local.get(["data"], (result) => {
        resolve(result.data.user_id);
      });
    });

    if (tabId && tabUrl) {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ["takeScreenShot.js"],
        },
        () => {
          chrome.tabs.sendMessage(
            tabId,
            { action: "canvasScreenShot" },
            async (response) => {
              if (response.status === "success") {
                const { screenshotBase64, diffBase64 } = response.result;
                const SERVER_URL = message.SERVER_URL;

                const screenshotFile = base64ToFile(
                  screenshotBase64.split(",")[1],
                  "screenshot.png",
                  "image/png",
                );
                const diffFile = base64ToFile(
                  diffBase64 ? diffBase64.split(",")[1] : "",
                  "diff.png",
                  "image/png",
                );

                try {
                  const formData = new FormData();

                  formData.append("tabUrl", tabUrl);
                  formData.append("historyImages", screenshotFile);
                  formData.append("historyImages", diffFile);

                  await axios.post(`${SERVER_URL}/${userId}`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  });
                } catch (error) {
                  console.error("Error sending data to server:", error);
                }
              } else {
                console.error("Error:", response.message);
              }
            },
          );
        },
      );
    }
  });
}
