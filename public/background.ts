import axios from "axios";

chrome.runtime.onMessage.addListener(function (message) {
  switch (message.action) {
    case "oauth2":
      handleGetAccessToken(message);
      break;
    case "fetchDiffData":
      handleFetchDiffData(message);
      break;
  }
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

    const formData = new FormData();

    formData.append("tabUrl", tabUrl);
    formData.append("figmaUrl", figmaUrl);
    formData.append("accessToken", accessToken);

    const response = await axios.post(`${SERVER_URL}/figma-data`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
          tabUrl: tabUrl,
        });
      },
    );
  } catch (error) {
    chrome.runtime.sendMessage({ action: "serverError" });

    console.error("An error occurred:", error);
  }
}
