import { ReactNode } from "react";

type ButtonProps<T extends ReactNode> = {
  onClick: () => void;
  children: T;
  className?: string;
  disabled?: boolean;
};

const Button = <T extends ReactNode>({
  onClick,
  children,
  className = "",
  disabled = false,
}: ButtonProps<T>) => {
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
