import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number;
  currentStage: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  currentStage,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

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
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [progress, animatedProgress]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4">
      <p className="text-lg text-center font-semibold w-full text-gray-700 mb-4">
        {Math.round(animatedProgress)}% 완료
      </p>
      <div className="relative w-full max-w-lg bg-gray-200 rounded-full h-2.5 mt-4 overflow-hidden">
        <div
          className="absolute top-0 left-0 bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-500">{currentStage}</p>
    </div>
  );
};

export default ProgressBar;
