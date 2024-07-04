import React from "react";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2 text-white rounded shadow-md transition duration-300 ease-in-out ${
        className || "bg-indigo-600 hover:bg-indigo-700"
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
