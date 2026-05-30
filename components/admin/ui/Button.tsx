"use client";

// Shared button used on the admin auth pages (login and signup).
// primary   — solid blue, main CTA. Stays the same in dark mode.
// secondary — light blue in light, dark blue in dark mode.

import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const variants = {
    primary:
      "bg-primary text-white hover:scale-[0.98] active:scale-95 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:scale-100 disabled:cursor-not-allowed",
    secondary:
      "bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full py-4 px-8 rounded-full font-bold text-sm font-nunito transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
