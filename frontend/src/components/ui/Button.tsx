import type { ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white",

    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-100",

    danger:
      "bg-red-600 hover:bg-red-500 text-white",
  };

  return (
    <button
      className={`
        px-4
        py-2
        rounded-lg
        transition-colors
        font-medium
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}