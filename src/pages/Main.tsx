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
  const [webContentVisible, setWebContentVisible] = useState(false);
  const WEB_URL = import.meta.env.VITE_WEB_URL;
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

  const toggleWebContent = () => {
    setWebContentVisible(!webContentVisible);
  };

  const handleNavigate = () => {
    window.open(WEB_URL, "_blank");
  };

  if (isLoading) {
    return <Loading condition={!isLoading} error={false} />;
  }

  return (
    <div className="w-full p-8 bg-white rounded-t-none shadow-lg mt-0">
      <h1 className="text-2xl font-bold text-gray-800 mt-0 mb-2">FigDiff</h1>
      <hr className="border-gray-300 my-2" />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button
          onClick={() => setWebContentVisible(false)}
          className={`w-full ${!webContentVisible ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300"}`}
        >
          Diffing
        </Button>
        <Button
          onClick={toggleWebContent}
          className={`w-full ${webContentVisible ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300"}`}
        >
          Web
        </Button>
      </div>
      {webContentVisible ? (
        <div className="px-4 mt-6 font-serif">
          <h2 className="text-lg text-gray-700 mb-4">Web에서 내역 확인하기</h2>
          <p>
            저장한 결과를 URL 단위로 히스토리 내역을 통해 확인해 보실 수
            있습니다!
          </p>
          <Button
            onClick={handleNavigate}
            className="bg-purple-500 hover:bg-purple-700 mt-6"
          >
            FigDiff 웹페이지로 이동
          </Button>
        </div>
      ) : (
        <>
          <div className="px-4 font-serif">
            <h2 className="text-lg text-gray-700 mt-6 mb-4">
              FigDiff 사용방법
            </h2>
            <ul className="list-disc pl-4 text-gray-600">
              <li>다양한 Figma 파일의 입력</li>
              <li>URL 전체 복사</li>
              <li>URL 입력창에 붙여넣기</li>
              <li>제출하기 버튼을 통한 디자인 비교 진행</li>
            </ul>
          </div>
          <UrlInput
            value={figmaUrl}
            onChange={(event) => setFigmaUrl(event.target.value)}
            isValid={isValidUrl}
            placeholder="https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png"
          />
          {isValidUrl === false && (
            <p className="text-center text-red-500 mb-4">
              유효한 URL이 아닙니다.
            </p>
          )}
          <Button
            onClick={handlePostData}
            className={`${isValidUrl ? "bg-green-500 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"}`}
            disabled={!isValidUrl}
          >
            제출하기
          </Button>
        </>
      )}
    </div>
  );
};

export default Main;
