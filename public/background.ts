chrome.runtime.onMessage.addListener(function (message: {
  action: string;
  code: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}) {
  switch (message.action) {
    case "oauth2":
      handleGetAccessToken(message);
      break;
  }
});

async function handleGetAccessToken(message: {
  action: string;
  code: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}) {
  const code: string = message.code;
  const CLIENT_ID: string = message.CLIENT_ID;
  const CLIENT_SECRET: string = message.CLIENT_SECRET;

  try {
    const response = await fetch("https://www.figma.com/api/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: `https://${chrome.runtime.id}.chromiumapp.org/`,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching token: ${response.statusText}`);
    }

    const data = await response.json();
    console.info(data);
    chrome.storage.local.set({ data: data }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting data:", chrome.runtime.lastError);
      } else {
        console.info("Data saved successfully");

        chrome.storage.local.get(["data"], (result) => {
          console.info("Stored data:", result.data);
        });
      }
    });
  } catch (error) {
    console.error("Error fetching token:", error);
  }
}
