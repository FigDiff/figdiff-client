import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number;
  currentStage: string;
}

const ProgressBar = ({ progress, currentStage }: ProgressBarProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const animateProgress = () => {
      if (animatedProgress < progress) {
        setAnimatedProgress((prev) => Math.min(prev + 1, progress));
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      const sessionKey = `session_${tabId}`;

      chrome.storage.session.get([sessionKey], (result) => {
        const sessionData = result[sessionKey] || {};
        const sessionProgress = sessionData.progress ?? 0;
        const sessionDataFetched = sessionData.isDataFetched ?? false;

        if (sessionDataFetched === true && sessionProgress === 100) {
          setAnimatedProgress(100);
          return;
        }

        if (progress !== 100) {
          animationFrameId = requestAnimationFrame(animateProgress);
        } else {
          setAnimatedProgress(100);
        }
      });
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [progress, animatedProgress]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <p className="text-lg text-center font-semibold w-full text-gray-700 mb-4">
        {Math.round(animatedProgress)}% 완료
      </p>
      <div className="relative w-full max-w-lg bg-gray-200 rounded-full h-2.5 mt-4 overflow-hidden">
        <div
          className="absolute top-0 left-0 bg-indigo-600 h-2.5 rounded-full"
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-2 ">{currentStage}</p>
    </div>
  );
};

export default ProgressBar;
