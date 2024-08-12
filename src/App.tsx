import { useEffect, useState } from "react";

import Main from "./pages/Main";
import Login from "./pages/Login";

function App() {
  const [accessToken, isAccessToken] = useState("");

  useEffect(() => {
    chrome.storage.local.get("WEB_URL", (result) => {
      if (!result.WEB_URL) {
        chrome.storage.local.set({ WEB_URL: import.meta.env.VITE_WEB_URL });
      }
    });

    chrome.storage.local.get("data", (result) => {
      if (result.data && result.data.access_token) {
        isAccessToken(result.data.access_token);
      }
    });
  }, [accessToken]);

  return (
    <div className="min-w-80 flex items-center">
      {accessToken ? <Main /> : <Login />}
    </div>
  );
}

export default App;
