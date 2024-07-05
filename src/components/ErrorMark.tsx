import React from "react";

const ErrorMark: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-4">
      <svg
        className="w-16 h-16 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
};

export default ErrorMark;
