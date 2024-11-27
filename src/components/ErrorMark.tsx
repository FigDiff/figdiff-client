const ErrorMark = () => {
  return (
    <div className="flex items-center justify-center mb-6 relative">
      <svg
        className="w-24 h-24 text-red-600"
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
      <div className="absolute -inset-2 rounded-full border-4 border-red-300 opacity-50 animate-pulse"></div>
    </div>
  );
};

export default ErrorMark;
