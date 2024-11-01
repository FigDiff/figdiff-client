chrome.storage.local.get(["data", "WEB_URL"], (result) => {
  if (chrome.runtime.lastError) {
    console.error("Error retrieving user ID:", chrome.runtime.lastError);
    return;
  }

  const userId = result.data.user_id;

  if (userId) {
    window.location.href = `/dash/${userId}`;
  }
});
