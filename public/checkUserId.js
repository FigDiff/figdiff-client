chrome.storage.local.get(["data", "WEB_URL"], (result) => {
  if (chrome.runtime.lastError) {
    console.error("Error retrieving user ID:", chrome.runtime.lastError);
    return;
  }

  const userId = result.data.user_id;
  const WEB_URL = result.WEB_URL;

  if (userId) {
    window.location.href = `${WEB_URL}/${userId}`;
  } else {
    window.location.href = `${WEB_URL}`;
  }
});
