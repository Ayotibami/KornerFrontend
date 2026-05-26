"use client";

import { useState } from "react";
import { nunito } from "@/lib/font";
import { primaryColor, secondaryColor } from "@/app/constants/color";

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label?: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "0.875rem",
            fontWeight: 700,
            color: primaryColor,
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "0.95rem",
          padding: "12px 16px",
          borderRadius: 30,
          border: `2px solid ${focused ? primaryColor : secondaryColor}`,
          boxShadow: focused ? "0 0 0 3px rgba(22, 90, 191, 0.12)" : "none",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: disabled ? "#E9EFF8" : focused ? "white" : "#F0F5FF",
          cursor: disabled ? "not-allowed" : "text",
          opacity: disabled ? 0.7 : 1,
        }}
      />
    </div>
  );
}
