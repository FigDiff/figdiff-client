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
}) {
  try {
    const { figmaUrl, accessToken, SERVER_URL } = message;

    const tabData = await new Promise<{ url: string; id: number }>(
      (resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];

          if (!activeTab || !activeTab.url || activeTab.id === undefined) {
            console.error("Active tab not found or missing properties.");
            reject(new Error("Active tab not found or missing properties."));

            return;
          }

          resolve({ url: activeTab.url, id: activeTab.id });
        });
      },
    );

    const formData = new FormData();
    formData.append("tabUrl", tabData.url);
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
        target: { tabId: tabData.id },
        files: ["renderDifferences.js"],
      },
      () => {
        chrome.tabs.sendMessage(tabData.id, {
          action: "renderDifferences",
          data,
          tabUrl: tabData.url,
        });

        chrome.runtime.sendMessage({
          action: "dataFetched",
          success: true,
          data,
        });
      },
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
