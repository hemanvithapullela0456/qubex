import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
