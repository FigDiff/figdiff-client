function clearSession() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId) {
      const sessionKey = `session_${tabId}`;
      chrome.storage.session.remove([sessionKey]);
    }
  });
}

export default clearSession;
