import React from "react";
import Button from "../components/Button";
import Introduction from "../components/Introduction";

const Login: React.FC = () => {
  const clickev = () => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `https://www.figma.com/oauth?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=https://${chrome.runtime.id}.chromiumapp.org/&scope=file_read&state=state&response_type=code`,
        interactive: true,
      },
      function (redirectUrl) {
        if (
          chrome.runtime.lastError ||
          !redirectUrl ||
          redirectUrl.includes("error")
        ) {
          console.error("Error during authentication");
        } else {
          const urlParams = new URLSearchParams(new URL(redirectUrl).search);
          const code = urlParams.get("code");

          if (code) {
            chrome.runtime.sendMessage({
              action: "oauth2",
              code,
              CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
              CLIENT_SECRET: import.meta.env.VITE_CLIENT_KEY,
            });
          } else {
            console.error("No code found in redirect URL");
          }
        }
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Introduction />
      <Button onClick={clickev}>Figma 계정으로 로그인</Button>
    </div>
  );
};

export default Login;
