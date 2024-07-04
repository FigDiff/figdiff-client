import React from "react";

type UrlInputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean | null;
  placeholder: string;
};

const UrlInput: React.FC<UrlInputProps> = ({
  value,
  onChange,
  isValid,
  placeholder,
}) => {
  return (
    <input
      type="text"
      className={`w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 ${
        isValid === null
          ? "focus:ring-green-500"
          : isValid
            ? "border-green-500 focus:ring-green-500"
            : "border-red-500 focus:ring-red-500"
      }`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default UrlInput;
