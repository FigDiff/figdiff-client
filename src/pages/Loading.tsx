import React, { useEffect, useState } from "react";
import Main from "./Main";
import Spinner from "../components/Spinner";
import CheckMark from "../components/CheckMark";
import ErrorMark from "../components/ErrorMark";
import Button from "../components/Button";

interface LoadingProps {
  condition: boolean;
  error: boolean;
}

const Loading: React.FC<LoadingProps> = ({ condition, error }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    } else if (condition) {
      setIsLoading(false);

      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, [condition, error]);

  useEffect(() => {
    const messageListener = (message: { action: string }) => {
      if (message.action === "renderDifferences") {
        setIsDataFetched(true);
        setIsLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleRetry = () => {
    setShowMain(true);
  };

  if (showMain) {
    return <Main />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <p className="text-lg text-center font-semibold w-full text-gray-700 mb-4">
          비교를 진행 중입니다. 잠시만 기다려주세요.
        </p>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <p className="text-lg text-center font-semibold w-full text-red-700 mb-4">
          비교에 실패하였습니다. 다시 시도해주세요.
        </p>
        <ErrorMark />
        <Button
          onClick={handleRetry}
          className="bg-red-500 hover:bg-red-700 mt-4 w-full"
        >
          URL 다시 입력하기
        </Button>
      </div>
    );
  }

  if (isDataFetched) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <p className="text-lg font-semibold text-gray-700 mb-4">
          비교가 완료되었습니다!
        </p>
        <CheckMark />
      </div>
    );
  }

  return null;
};

export default Loading;
