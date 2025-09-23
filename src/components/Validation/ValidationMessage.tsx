import React from "react";

interface ValidationMessageProps {
  error?: string;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  error,
  className = "",
}) => {
  if (!error) return null;

  return (
    <div className={`text-xs text-red-500 mt-1 ${className}`}>{error}</div>
  );
};
