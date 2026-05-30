"use client";

// Shared form input for the admin auth pages.
// Automatically handles password fields: shows an eye icon toggle to reveal/hide the value.
// The `peer` class lets the eye button use peer-focus:text-primary without JS.

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = {
  label?: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-bold text-primary font-nunito">{label}</label>
      )}

      <div className="relative">
        <input
          type={resolvedType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            peer w-full font-nunito text-[0.95rem] rounded-full border-2 border-secondary
            dark:border-[#2a4a7a]
            bg-[#F0F5FF] dark:bg-[#1e2a3a]
            text-[#0f1e3d] dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-600
            px-4 py-3 outline-none
            transition-[border-color,box-shadow,background-color] duration-200
            focus:border-primary focus:bg-white dark:focus:bg-[#243347] focus:ring-2 focus:ring-primary/10
            disabled:bg-[#E9EFF8] dark:disabled:bg-[#1a2535] disabled:cursor-not-allowed disabled:opacity-70
            ${isPassword ? "pr-12" : ""}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            disabled={disabled}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
