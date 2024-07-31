import React, { useEffect, useState } from "react";
import Main from "./Main";
import ErrorMark from "../components/ErrorMark";
import ProgressBar from "../components/ProgressBar";

const Loading: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isDataFetchError, setIsDataFetchError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("분석 준비중입니다");
  const [annotatedImage, setAnnotatedImage] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [saveSuccessful, setSaveSuccessful] = useState(false);

  useEffect(() => {
    const handleMessage = (message: { action: string }) => {
      if (message.action === "serverError") {
        setIsLoading(false);
        setIsDataFetched(false);
        setIsDataFetchError(true);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      const sessionKey = `session_${tabId}`;

      chrome.storage.session.get([sessionKey], (result) => {
        const sessionData = result[sessionKey] || {};

        setAnnotatedImage(sessionData.annotatedImage ?? "");
        setProgress(sessionData.progress ?? 0);
        setCurrentStage(sessionData.currentStage ?? "분석 준비중입니다");
        setIsDataFetched(sessionData.isDataFetched ?? false);
        setIsDataFetchError(sessionData.isDataFetchError ?? false);
      });

      if (!isDataFetched) {
        const eventSource = new EventSource(
          import.meta.env.VITE_SERVER_URL + "/progress",
        );

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.progress) {
            setCurrentStage(data.stage);
            setProgress(data.progress);

            let imageUrl = "";

            if (data.optionalData) {
              const annotatedImageBuffer = data.optionalData.data;
              const uinit8Array = new Uint8Array(annotatedImageBuffer);
              const blob = new Blob([uinit8Array], {
                type: "image/png",
              });
              imageUrl = URL.createObjectURL(blob);

              setAnnotatedImage(imageUrl);
              setIsImageLoading(true);
            }

            const newSessionData = {
              progress: data.progress,
              currentStage: data.stage,
              isDataFetched: data.progress === 100,
              isDataFetchError: false,
              isLoading: true,
              annotatedImage: imageUrl,
            };

            chrome.storage.session.set({
              [sessionKey]: newSessionData,
            });

            if (data.progress === 100) {
              setIsDataFetched(true);

              eventSource.close();
            }
          }
        };

        eventSource.onerror = (error) => {
          console.error("SSE Error:", error);

          setIsLoading(false);
          setIsDataFetched(false);
          setIsDataFetchError(true);
        };

        return () => {
          eventSource.close();
        };
      }
    });
  }, [isDataFetched]);

  const handleRetry = () => {
    setIsLoading(false);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        const sessionKey = `session_${tabId}`;

        chrome.storage.session.remove([sessionKey], () => {
          setShowMain(true);
        });
      }
    });
  };

  const handleDataSave = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    chrome.runtime.sendMessage({ action: "takeScreenShot", SERVER_URL });
    setSaveSuccessful(true);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  if (showMain) {
    return <Main />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      {isLoading && (
        <ProgressBar progress={progress} currentStage={currentStage} />
      )}
      {isDataFetched && (
        <div>
          {annotatedImage && (
            <img
              src={annotatedImage}
              alt="annotatedImage"
              onLoad={handleImageLoad}
              style={{ display: isImageLoading ? "none" : "block" }}
            />
          )}
          {isImageLoading && (
            <div className="flex items-center mt-4">
              <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-blue-500 ml-4 text-lg font-medium">
                이미지 로딩 중...
              </p>
            </div>
          )}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleDataSave}
              disabled={saveSuccessful}
              className={`text-white rounded transition duration-300 ease-in-out ${saveSuccessful ? "bg-sky-300" : "bg-gray-400 hover:bg-gray-600"} py-3 px-4`}
            >
              {saveSuccessful ? "✓ 저장 성공!" : "💾 내역 저장하기"}
            </button>
            <button
              onClick={handleRetry}
              className="text-white rounded transition duration-300 ease-in-out bg-gray-400 hover:bg-gray-600 py-3 px-4"
            >
              🔄 입력창으로 돌아가기
            </button>
          </div>
        </div>
      )}
      {isDataFetchError && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="text-base text-center font-semibold w-full text-red-700">
            비교에 실패하였습니다.
          </p>
          <p className="text-base text-center font-semibold w-full text-red-700 mb-8">
            다시 시도해주세요.
          </p>
          <ErrorMark />
          <button
            onClick={handleRetry}
            className="text-white rounded transition duration-300 ease-in-out bg-gray-400 hover:bg-gray-600 py-3 px-4"
          >
            🔄 입력창으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default Loading;
