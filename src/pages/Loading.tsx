import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import CheckMark from "../components/CheckMark";
import ErrorMark from "../components/ErrorMark";

interface LoadingProps {
  condition: boolean;
  error: boolean;
}

const Loading: React.FC<LoadingProps> = ({ condition, error }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    } else if (condition) {
      setIsLoading(false);
    }
  }, [condition, error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLoading ? (
        <>
          <p className="text-lg font-semibold text-gray-700">
            비교를 진행 중입니다. 잠시만 기다려주세요.
          </p>
          <Spinner />
        </>
      ) : error ? (
        <>
          <p className="text-lg font-semibold text-red-700">
            비교에 실패하였습니다. 다시 시도해주세요.
          </p>
          <ErrorMark />
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-gray-700">
            비교가 완료되었습니다!
          </p>
          <CheckMark />
        </>
      )}
    </div>
  );
};

export default Loading;
