import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAccessToken";
import { isValidFigmaUrl } from "../utils/utils";

import Loading from "../pages/Loading";
import UrlInput from "../components/UrlInput";
import Button from "../components/Button";

const Main: React.FC = () => {
  const { accessToken } = useAuthStore();
  const [figmaUrl, setFigmaUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (figmaUrl) {
      setIsValidUrl(isValidFigmaUrl(figmaUrl));
    } else {
      setIsValidUrl(null);
    }
  }, [figmaUrl]);

  const handlePostData = () => {
    chrome.runtime.sendMessage({
      action: "fetchDiffData",
      figmaUrl,
      accessToken,
      SERVER_URL,
    });

    setIsLoading(true);
  };

  if (isLoading) {
    return <Loading condition={!isLoading} error={false} />;
  }

  return (
    <div className="w-full p-8 bg-white rounded shadow-md">
      <h1 className="text-center text-gray-700 mb-2">
        피그마 파일 URL을 입력해주세요!
      </h1>
      <UrlInput
        value={figmaUrl}
        onChange={(event) => setFigmaUrl(event.target.value)}
        isValid={isValidUrl}
        placeholder="URL 입력"
      />
      {isValidUrl === false && (
        <p className="text-center text-red-500 mb-4">유효한 URL이 아닙니다</p>
      )}
      <Button
        onClick={handlePostData}
        className={`${isValidUrl ? "bg-green-500" : "bg-gray-500 cursor-not-allowed"}`}
        disabled={!isValidUrl}
      >
        제출하기
      </Button>
    </div>
  );
};

export default Main;
