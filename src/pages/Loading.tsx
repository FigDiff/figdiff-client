import React, { useEffect, useState } from "react";
import Main from "./Main";
import CheckMark from "../components/CheckMark";
import ErrorMark from "../components/ErrorMark";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";

interface LoadingProps {
  condition: boolean;
  error: boolean;
}

const Loading: React.FC<LoadingProps> = ({ condition, error }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("분석 준비중입니다");

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
    const eventSource = new EventSource(
      import.meta.env.VITE_SERVER_URL + "/progress",
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.progress) {
        setCurrentStage(data.stage);
        setProgress(data.progress);

        if (data.progress === 100) {
          eventSource.close();
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setIsLoading(false);
      setIsDataFetched(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    let interval: number;

    if (animatedProgress < progress) {
      interval = window.setInterval(() => {
        setAnimatedProgress((prev) => Math.min(prev + 1, progress));
      }, 50);
    } else if (animatedProgress < 100 && progress === 100) {
      interval = window.setInterval(() => {
        setAnimatedProgress((prev) => Math.min(prev + 1, 100));
      }, 50);
    } else if (animatedProgress === 100) {
      setIsDataFetched(true);
      setIsLoading(false);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [progress, animatedProgress]);

  const handleRetry = () => {
    setShowMain(true);
  };

  if (showMain) {
    return <Main />;
  }

  if (isLoading) {
    return <ProgressBar progress={progress} currentStage={currentStage} />;
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
